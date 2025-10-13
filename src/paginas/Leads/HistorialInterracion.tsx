import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Dropdown,
  Menu,
  message,
  Modal,
} from "antd";
import {
  FileTextOutlined,
  WhatsAppOutlined,
  BellOutlined,
  DesktopOutlined,
  GlobalOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";

type Interaccion = {
  id: number;
  idOportunidad: number;
  detalle: string;
  tipo: "Nota" | "Recordatorio" | "WSP";
  celular: string;
  fechaRecordatorio: string;
  fechaModificacion: string;
  idMigracion: number;
  estado: boolean;
};

export default function HistorialInteraccion({
  idOportunidad,
  celular,
}: {
  idOportunidad?: string;
  celular: string; // número con prefijo, ej: "+51987654321" o "51987654321"
}) {
  const [interacciones, setInteracciones] = useState<Interaccion[]>([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
  const [mensajeTexto, setMensajeTexto] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    fetchInteracciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOportunidad]);

  const fetchInteracciones = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/VTAModVentaOportunidad/HistorialInteraccion/PorOportunidad/${idOportunidad}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Interacciones obtenidas:", res.data);
      setInteracciones(res.data.historialInteraccion || []);
    } catch (err) {
      console.error("❌ Error al obtener interacciones:", err);
      message.error("Error al obtener historial de interacciones");
    }
  };

  const handleTipoSelect = (tipo: string) => {
    setTipoSeleccionado(tipo);
  };

  const handleEnviar = async () => {
    if (!tipoSeleccionado) return;

    if (tipoSeleccionado === "WSP") {
      setModalVisible(true);
      return;
    }

    // POST directo para Nota o Recordatorio
    try {
      const body = {
        idOportunidad,
        detalle: mensajeTexto,
        tipo: tipoSeleccionado,
        celular: "", // no aplica
        fechaRecordatorio: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
        idMigracion: 0,
        estado: true,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/VTAModVentaHistorialInteraccion/Insertar`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Interacción registrada correctamente");
      setMensajeTexto("");
      setTipoSeleccionado(null);
      fetchInteracciones();
    } catch (err) {
      console.error("❌ Error al enviar interacción:", err);
      message.error("Error al registrar interacción");
    }
  };

  // ------------------------------------------------------------------
  // Helpers para número + construcción de URLs
  // ------------------------------------------------------------------
  const sanitizePhone = (raw: string | undefined) => {
    if (!raw) return "";
    // quitar todo lo que no sea dígito
    const digits = (raw || "").replace(/\D+/g, "");
    return digits;
  };

  const phoneDigits = sanitizePhone(celular);

  const isPhoneValid = (digits: string) => {
    // regla simple: mínimo 6 dígitos y máximo 15 (WhatsApp acepta hasta 15)
    return digits.length >= 6 && digits.length <= 15;
  };

  // Desktop: copia y abre esquema
  const handleDesktopClick = async () => {
    if (!isPhoneValid(phoneDigits)) {
      message.warning("Número inválido para WhatsApp.");
      return;
    }
    try {
      // copia mensaje
      await navigator.clipboard.writeText(mensajeTexto);
      message.success("Mensaje copiado al portapapeles");

      // intenta abrir la app nativa (esquema whatsapp://)
      const url = `whatsapp://send?phone=${phoneDigits}&text=${encodeURIComponent(
        mensajeTexto
      )}`;
      // abrir en nueva pestaña (si el sistema no tiene handler, puede fallar silenciosamente)
      window.open(url, "_blank");
    } catch (err) {
      console.warn("No se pudo abrir esquema whatsapp:// o copiar", err);
      message.info("Intenta pegar el mensaje manualmente en la app de WhatsApp.");
    }
  };

  // Web: abre web.whatsapp.com con número y texto
  const handleWebClick = () => {
    if (!isPhoneValid(phoneDigits)) {
      message.warning("Número inválido para WhatsApp.");
      return;
    }
    const encodedMsg = encodeURIComponent(mensajeTexto);
    const url = `https://web.whatsapp.com/send?phone=${phoneDigits}&text=${encodedMsg}`;
    window.open(url, "_blank");
  };

  // POST para guardar interacción WSP (usa el `celular` original para backend)
  const handleGuardarWSP = async () => {
    if (!isPhoneValid(phoneDigits)) {
      message.warning("Número inválido para registrar envío por WhatsApp.");
      return;
    }

    try {
      const body = {
        idOportunidad,
        detalle: mensajeTexto,
        tipo: "WSP",
        celular: celular, // envío la versión con prefijo/raw tal como pasas por props
        fechaRecordatorio: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
        idMigracion: 0,
        estado: true,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/VTAModVentaHistorialInteraccion/Insertar`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Mensaje por WhatsApp registrado correctamente");
      setModalVisible(false);
      setMensajeTexto("");
      setTipoSeleccionado(null);
      fetchInteracciones();
    } catch (err) {
      console.error("❌ Error al guardar WSP:", err);
      message.error("Error al registrar mensaje de WhatsApp");
    }
  };

  const formatFecha = (fecha?: string) => {
  if (!fecha) return "";
  try {
    const date = new Date(fecha);
    return date.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return fecha; // fallback si falla
  }
};

  const menu = (
    <Menu>
      <Menu.Item key="Nota" onClick={() => handleTipoSelect("Nota")}>
        <FileTextOutlined style={{ marginRight: 8 }} />
        Nota
      </Menu.Item>
      <Menu.Item key="Recordatorio" onClick={() => handleTipoSelect("Recordatorio")}>
        <BellOutlined style={{ marginRight: 8 }} />
        Recordatorio
      </Menu.Item>
      <Menu.Item key="WSP" onClick={() => handleTipoSelect("WSP")}>
        <WhatsAppOutlined style={{ marginRight: 8 }} />
        WhatsApp
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <h4 style={{ marginBottom: 8, fontWeight: 700 }}>
        Historial de Interacción ({interacciones.length})
      </h4>

      <Card
        style={{
          backgroundColor: "#f1f5f598",
          borderRadius: 12,
          minHeight: 100,
        }}
      >
        {/* Filtros */}
        <Card
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 4,
            marginBottom: 12,
          }}
          bodyStyle={{ padding: 4 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13 }}>Filtros:</span>
            <Button icon={<FileTextOutlined />} style={{ backgroundColor: "#cfe8ff", borderColor: "#cfe8ff" }}>
              Notas
            </Button>
            <Button icon={<WhatsAppOutlined />} style={{ backgroundColor: "#cfe8ff", borderColor: "#cfe8ff" }}>
              Envíos por WSP
            </Button>
            <Button icon={<BellOutlined />} style={{ backgroundColor: "#cfe8ff", borderColor: "#cfe8ff" }}>
              Recordatorios
            </Button>
          </div>
        </Card>

        {/* Lista de interacciones */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {interacciones.map((item) => {
            let bgColor = "#fff";
            if (item.tipo === "Recordatorio") bgColor = "#f3f4f6";
            if (item.tipo === "WSP") bgColor = "#d1fae5";

            return (
              <Card
                key={item.id}
                size="small"
                style={{
                  borderRadius: 8,
                  backgroundColor: bgColor,
                  padding: 8,
                  textAlign: "right",
                }}
              >
                {item.tipo === "WSP" && <p style={{ margin: 0 }}>{item.celular}</p>}
                <p style={{ margin: 0 }}>{item.detalle}</p>
                {item.tipo === "Recordatorio" && <p style={{ margin: 0 }}>{item.fechaRecordatorio}</p>}
                <p style={{ color: "#6b7280", margin: 0 }}>
                {item.fechaModificacion}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Input + Botones */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Input.TextArea
            placeholder="Escribe un mensaje..."
            maxLength={200}
            autoSize={{ minRows: 3, maxRows: 5 }}
            style={{ flex: 1 }}
            value={mensajeTexto}
            onChange={(e) => setMensajeTexto(e.target.value)}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Dropdown overlay={menu} placement="top">
              <Button type="primary">{tipoSeleccionado ? tipoSeleccionado : "Tipo"}</Button>
            </Dropdown>
            <Button
              disabled={!tipoSeleccionado || !mensajeTexto.trim()}
              onClick={handleEnviar}
              style={{
                backgroundColor: tipoSeleccionado ? "#1677ff" : "#d1d5db",
                color: tipoSeleccionado ? "#fff" : "#111827",
              }}
            >
              Enviar
            </Button>
          </div>
        </div>
      </Card>

      {/* MODAL WSP */}
      <Modal open={modalVisible} footer={null} closable={false} centered width={520}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid #e5e7eb" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Enviar mensaje por Whatsapp</h3>
          <Button type="text" icon={<CloseOutlined />} onClick={() => setModalVisible(false)} />
        </div>

        <div style={{ padding: "16px 0" }}>
          <p style={{ marginBottom: 12, color: "#374151" }}>
            Selecciona cómo deseas enviar el mensaje. Para desktop, el mensaje se copiará automáticamente.
          </p>

          <Card style={{ backgroundColor: "#f9fafb", borderRadius: 8, marginBottom: 12 }}>
            <p style={{ margin: 0 }}>{mensajeTexto || <i style={{ color: "#6b7280" }}>Vista previa vacía</i>}</p>
          </Card>

          <div style={{ display: "flex", gap: 12 }}>
            {/* BOTÓN: Whatsapp Desktop */}
            <div style={{ flex: 1 }}>
              <Button
                onClick={handleDesktopClick}
                style={{
                  width: "100%",
                  minHeight: 110,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  backgroundColor: "#f3f4f6",
                  borderColor: "#f3f4f6",
                }}
              >
                <DesktopOutlined style={{ fontSize: 22, color: "#111827" }} />
                <div style={{ fontWeight: 600, color: "#111827" }}>Whatsapp Desktop</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Copia el mensaje y abre la app</div>
              </Button>
            </div>

            {/* BOTÓN: Whatsapp Web */}
            <div style={{ flex: 1 }}>
              <Button
                onClick={handleWebClick}
                style={{
                  width: "100%",
                  minHeight: 110,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  backgroundColor: "#f3f4f6",
                  borderColor: "#f3f4f6",
                }}
              >
                <GlobalOutlined style={{ fontSize: 22, color: "#111827" }} />
                <div style={{ fontWeight: 600, color: "#111827" }}>Whatsapp Web</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Abre directamente el navegador</div>
              </Button>
            </div>
          </div>

          <Card style={{ backgroundColor: "#dbeafe", borderRadius: 8, marginTop: 12 }}>
            <ExclamationCircleOutlined style={{ color: "#1d4ed8", marginRight: 6 }} />
            <span style={{ color: "#1d4ed8", fontSize: 13 }}>
              Tip: Si eliges Desktop, el mensaje se copiará automáticamente al portapapeles para que puedas pegarlo fácilmente.
            </span>
          </Card>
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
          <Button type="primary" block style={{ background: "#000", borderColor: "#000", fontWeight: 600 }} onClick={handleGuardarWSP}>
            Guardar
          </Button>
        </div>
      </Modal>
    </>
  );
}
