import React, { useState } from "react";
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

const { Text, Title } = Typography;

// === Datos de ejemplo ===
const interacciones = [
  { tipo: "promesa", texto: "Dijo que le pase el link de pago, QUE EL 30 HARA EL ABONADO", fecha: "Viernes 26 de Septiembre 2025 - FERNANDO" },
  { tipo: "nota", texto: "Recordatorio: viernes 25 de septiembre - 15:30\nDijo que le pase el link de pago, QUE EL 30 HARA EL ABONADO", fecha: "Jueves 25 de Septiembre 2025 - FERNANDO" },
  { tipo: "seguimiento", texto: "960051787\nDijo que le pase el link de pago, QUE EL 30 HARA EL ABONADO", fecha: "Miércoles 24 de Septiembre 2025 - ANA" },
  { tipo: "desuscrito", texto: "El cliente solicitó que ya no se le contacte nunca más.", fecha: "Lunes 22 de Septiembre 2025 - FERNANDO" },
];

type TipoInteraccion = "promesa" | "nota" | "seguimiento" | "desuscrito";

const colores: Record<TipoInteraccion, string> = {
  promesa: "#FFF7B3",
  nota: "#DCDCDC",
  seguimiento: "#DBFFD2",
  desuscrito: "#FFCDCD",
};

const tiposConfig = [
  { id: "seguimiento", nombre: "Seguimiento", color: "#DBFFD2", icon: <CheckOutlined /> },
  { id: "promesa", nombre: "Promesa / Pendiente", color: "#FFF7B3", icon: <EditOutlined /> },
  { id: "nota", nombre: "Nota", color: "#DCDCDC", icon: <CommentOutlined /> },
  { id: "desuscrito", nombre: "Desuscrito", color: "#FFCDCD", icon: <CloseOutlined /> },
];

const HistorialInteracciones: React.FC = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoInteraccion>("nota");
  const [nota, setNota] = useState<string>("");
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");

  const handleEnviar = () => {
    if (!nota.trim()) return;
    console.log("Nota enviada:", { tipo: tipoSeleccionado, texto: nota });
    setNota("");
  };

  const interaccionesFiltradas = interacciones.filter((i) => {
    const cumpleFiltro =
      filtrosActivos.length === 0 || filtrosActivos.includes(i.tipo);
    const cumpleBusqueda =
      busqueda.trim() === "" ||
      i.texto.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  // === Menú emergente de filtros ===
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
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#000",
                lineHeight: "16px",
              }}
            >
              {t.nombre}
            </span>
          </div>
        ))}
      </Space>

      <Divider style={{ margin: "8px 0" }} />

      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="primary"
          block
          style={{ background: "#005FF8" }}
        >
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
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

          <Dropdown
            trigger={["click"]}
            dropdownRender={() => menuFiltros}
            placement="bottomRight"
          >
            <Button
              icon={<FilterOutlined />}
              type="default"
              size="small"
              style={{
                color: "#005FF8",
                border: "1px solid #DCDCDC",
                borderRadius: 6,
                backgroundColor: "#FAFAFA",
                fontSize: 12,
                height: 24,
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
            interaccionesFiltradas.map((item, i) => (
              <Card
                key={i}
                size="small"
                style={{
                  background: colores[item.tipo as TipoInteraccion],
                  border: `1px solid ${colores[item.tipo as TipoInteraccion]}`,
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
                      lineHeight: "14px",
                      display: "block",
                      marginBottom: 1,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.texto}
                  </Text>
                  <Text
                    style={{
                      color: "#5D5D5D",
                      fontSize: 8,
                      lineHeight: "12px",
                    }}
                  >
                    {item.fecha}
                  </Text>
                </div>
              </Card>
            ))
          ) : (
            <Text
              style={{
                fontSize: 12,
                color: "#5D5D5D",
                textAlign: "center",
                width: "100%",
                display: "block",
              }}
            >
              No hay interacciones para los filtros seleccionados.
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
                      tipoSeleccionado === t.id
                        ? "0 0 0 2px rgba(0,0,0,0.25) inset"
                        : "none",
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
                  color: "#070D1A",
                  fontSize: 11,
                  fontWeight: 600,
                  resize: "none",
                  opacity: 0.8,
                }}
              />
            </div>

            <Button
              type="primary"
              shape="round"
              size="middle"
              style={{
                background: "#005FF8",
                border: "1px solid #DCDCDC",
                height: 37,
                minWidth: 40,
              }}
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
