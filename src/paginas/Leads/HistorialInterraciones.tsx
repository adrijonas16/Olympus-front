import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  Tooltip,
  Checkbox,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  CheckOutlined,
  EditOutlined,
  CommentOutlined,
  CloseOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { getCookie } from "../../utils/cookies";

const { Text, Title } = Typography;
type TipoInteraccion =
  | "desuscrito"
  | "whatsapp"
  | "nota"
  | "recordatorio";


const colores: Record<TipoInteraccion, string> = {
  nota: "#FFF7B3",
  whatsapp: "#DBFFD2",
  recordatorio: "#DCDCDC",
  desuscrito: "#FFCDCD",
};


const mapTipos: Record<number, TipoInteraccion> = {
  7: "desuscrito",
  8: "whatsapp",
  9: "nota",
  10: "recordatorio",
};

const tipoToId: Record<TipoInteraccion, number> = {
  desuscrito: 7,
  whatsapp: 8,
  nota: 9,
  recordatorio: 10,
};

const tiposConfig = [
  { id: "nota", nombre: "Nota", color: "#FFF7B3", icon: <CheckOutlined /> },
  { id: "whatsapp", nombre: "WhatsApp", color: "#DBFFD2", icon: <EditOutlined /> },
  { id: "recordatorio", nombre: "Recordatorio", color: "#DCDCDC", icon: <CommentOutlined /> },
  { id: "desuscrito", nombre: "Desuscrito", color: "#FFCDCD", icon: <CloseOutlined /> },
];

const HistorialInteracciones: React.FC = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoInteraccion>("nota");
  const [nota, setNota] = useState<string>("");
  const [interacciones, setInteracciones] = useState<any[]>([]);
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");

useEffect(() => {
  cargarHistorial(null); // primera carga: idTipo = null
}, []);

const cargarHistorial = async (idTipo: number | null) => {
  try {
    const token = getCookie("token"); // OBTENER TOKEN

    const url = `http://localhost:7020/api/VTAModVentaOportunidad/ObtenerHistorialInteraccionesOportunidad/1?idTipo=${idTipo ?? ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`, // 🔥 TOKEN AQUÍ
      },
    });

    if (!res.ok) {
      console.error("Error HTTP:", res.status);
      return;
    }

    const data = await res.json();
    setInteracciones(data.historialInteraciones || []);
  } catch (error) {
    console.error("Error cargando historial:", error);
  }
};
const handleEnviar = async () => {
  if (!nota.trim()) return;

  try {
    const token = getCookie("token");

    const payload = {
      id: 0,
      idOportunidad: 1,        // 🔥 por ahora fijo
      idTipo: tipoSeleccionado === "desuscrito" ? 7 :
              tipoSeleccionado === "whatsapp" ? 8 :
              tipoSeleccionado === "nota" ? 9 :
              tipoSeleccionado === "recordatorio" ? 10 : 9,
      detalle: nota,
      celular: "",
      fechaRecordatorio: null,
      estado: true,
      fechaCreacion: new Date().toISOString(),
      usuarioCreacion: "system",
      fechaModificacion: new Date().toISOString(),
      usuarioModificacion: "system"
    };

    const res = await fetch(
      "http://localhost:7020/api/VTAModVentaHistorialInteraccion/Insertar",
      {
        method: "POST",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,    // 🔥 token
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      console.error("Error HTTP:", res.status);
      return;
    }

    setNota("");

    // 🔄 Recargar historial después de insertar
    cargarHistorial(null);

  } catch (error) {
    console.error("Error al enviar nota:", error);
  }
};

  // ================================
  // 📌 FILTROS Y BÚSQUEDA
  // ================================
  const interaccionesFiltradas = interacciones.filter((i) => {
    const tipo = mapTipos[i.idTipo] ?? "nota";

    const cumpleFiltro =
      filtrosActivos.length === 0 || filtrosActivos.includes(tipo);

    const cumpleBusqueda =
      busqueda.trim() === "" ||
      i.detalle.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleFiltro && cumpleBusqueda;
  });

  // ================================
  // 📌 MENÚ DE FILTROS
  // ================================
  const menuFiltros = (
    <Card
      style={{
        width: 240,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        background: "#fff",
      }}
      bodyStyle={{ padding: 12 }}
    >
      <Title level={5} style={{ textAlign: "center", margin: "0 0 8px" }}>
        Filtros de Interacción
      </Title>

      <Space direction="vertical" style={{ width: "100%" }} size={6}>
        {tiposConfig.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: t.color,
              borderRadius: 6,
              padding: "4px 8px",
              gap: 8,
            }}
          >
            <Checkbox
              checked={filtrosActivos.includes(t.id)}
              onChange={(e) => {
                const checked = e.target.checked;
                setFiltrosActivos((prev) =>
                  checked ? [...prev, t.id] : prev.filter((f) => f !== t.id)
                );
              }}
              style={{ margin: 0 }}
            />
            <span style={{ fontSize: 12, fontWeight: 500 }}>{t.nombre}</span>
          </div>
        ))}
      </Space>

      <Divider style={{ margin: "8px 0" }} />

      <Space direction="vertical" style={{ width: "100%" }}>
        <Button type="primary" block style={{ background: "#005FF8" }}>
          Aplicar filtros
        </Button>
        <Button block onClick={() => setFiltrosActivos([])}>
          Limpiar filtros
        </Button>
      </Space>
    </Card>
  );

  return (
    <div style={{ width: "100%" }}>
      <Title level={5} style={{ marginBottom: 6 }}>
        Historial de Interacciones
      </Title>

      <Card
        style={{
          background: "#F0F0F0",
          boxShadow: "inset 1px 1px 3px rgba(0, 0, 0, 0.35)",
          borderRadius: 8,
          border: "1px solid #DCDCDC",
          padding: 6,
        }}
        bodyStyle={{
          padding: 6,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* === Barra superior === */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <Input
            placeholder="Buscar..."
            prefix={<SearchOutlined />}
            size="small"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              maxWidth: 220,
              borderRadius: 6,
              backgroundColor: "#F9F9F9",
              fontSize: 12,
            }}
          />

          <Dropdown trigger={["click"]} dropdownRender={() => menuFiltros} placement="bottomRight">
            <Button
              icon={<FilterOutlined />}
              size="small"
              style={{
                color: "#005FF8",
                border: "1px solid #DCDCDC",
                borderRadius: 6,
                backgroundColor: "#FAFAFA",
                fontSize: 12,
              }}
            >
              Filtros
            </Button>
          </Dropdown>
        </div>

        <Divider style={{ margin: "4px 0" }} />

        {/* === Lista de interacciones === */}
        <Space direction="vertical" style={{ width: "100%" }} size={4}>
          {interaccionesFiltradas.length > 0 ? (
            interaccionesFiltradas.map((item) => {
              const tipo = mapTipos[item.idTipo] ?? "nota";
              const fecha = new Date(item.fechaCreacion).toLocaleString();

              return (
                <Card
                  key={item.id}
                  size="small"
                  style={{
                    background: colores[tipo],
                    border: `1px solid ${colores[tipo]}`,
                    borderRadius: 6,
                    padding: 4,
                  }}
                  bodyStyle={{ padding: 4 }}
                >
                  <div style={{ textAlign: "right" }}>
                    <Text
                      style={{
                        color: "#0D0C11",
                        fontSize: 11,
                        display: "block",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {item.detalle}
                    </Text>

                    <Text style={{ fontSize: 8, color: "#5D5D5D" }}>
                      {fecha} – {item.usuarioCreacion}
                    </Text>
                  </div>
                </Card>
              );
            })
          ) : (
            <Text style={{ fontSize: 12, color: "#5D5D5D", textAlign: "center" }}>
              No hay interacciones.
            </Text>
          )}
        </Space>

        <Divider style={{ margin: "6px 0" }} />

        {/* === Campo de nota === */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Space size={4}>
            {tiposConfig.map((t) => (
              <Tooltip title={t.nombre} key={t.id}>
                <Button
                  shape="round"
                  size="small"
                  icon={t.icon}
                  onClick={() => setTipoSeleccionado(t.id as TipoInteraccion)}
                  style={{
                    background: t.color,
                    border: "none",
                    boxShadow:
                      tipoSeleccionado === t.id ? "0 0 0 2px rgba(0,0,0,0.25) inset" : "none",
                  }}
                />
              </Tooltip>
            ))}
          </Space>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                flex: 1,
                background: colores[tipoSeleccionado],
                borderRadius: 8,
                padding: "6px 8px",
              }}
            >
              <Input.TextArea
                placeholder="Escriba una nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  fontSize: 11,
                  fontWeight: 600,
                  resize: "none",
                }}
              />
            </div>

            <Button
              type="primary"
              shape="round"
              size="middle"
              style={{ background: "#005FF8", height: 37 }}
              icon={<SendOutlined style={{ color: "#fff" }} />}
              onClick={handleEnviar}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HistorialInteracciones;
