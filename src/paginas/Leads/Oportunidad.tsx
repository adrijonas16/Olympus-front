import React from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Row, Col, Space, Input } from "antd";
import {
  EditOutlined,
  CopyOutlined,
  FileOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
  WhatsAppOutlined,
  BellOutlined,
} from "@ant-design/icons";
import TablaEstadosReducida from "./TablaEstados";

const headerBg = "#0f1724";
const colMinWidth = 200;

export default function Oportunidad() {
  const { id } = useParams<{ id: string }>();

  const interacciones = [
  {
    tipo: "nota",
    mensaje: "Mensaje de la nota...",
    fecha: "24/12/2025",
    usuario: "FERNANDO",
  },
  {
    tipo: "nota",
    mensaje: "Mensaje de la nota...",
    fecha: "24/12/2025",
    usuario: "FERNANDO",
  },
  {
    tipo: "nota",
    mensaje: "Mensaje de la nota...",
    fecha: "24/12/2025",
    usuario: "FERNANDO",
  },
  {
    tipo: "nota",
    mensaje: "Mensaje de la nota...",
    fecha: "24/12/2025",
    usuario: "FERNANDO",
  },
  {
    tipo: "wsp",
    telefono: "+51 912345678",
    mensaje: "Mensaje enviado por WhatsApp...",
    fecha: "24/12/2025",
    usuario: "FERNANDO",
  },
  {
    tipo: "recordatorio",
    fechaRecordatorio: "Viernes 25 de septiembre - 15:30",
    mensaje: "Recordatorio importante...",
    fecha: "24/12/2025",
    usuario: "FERNANDO",
  },
];

  const infoCliente = [
    { label: "Nombre", value: "Juan" },
    { label: "Apellidos", value: "Pérez" },
    { label: "Teléfono", value: "+51 912345678" },
    { label: "País", value: "Perú" },
    { label: "Prefijo país", value: "+51" },
    { label: "Correo", value: "juan.perez@email.com" },
    { label: "Área de trabajo", value: "Recursos Humanos" },
    { label: "Desuscrito", value: "No" },
    { label: "Industria", value: "Tecnología" },
  ];

  // Datos de Oportunidad Actual (ejemplo)
  const oportunidadActual = {
    codigo: "RH2506",
    fechaCreacion: "2025-12-24",
    estado: "Calificado",
    llamadasContestadas: 2,
    llamadasNoContestadas: 1,
    asesor: "Edson Mayta",
  };

  const oportunidadActual2 = [
    {
      codigo: "1",
      fechaCreacion: "2025-12-24",
      estado: "Calificado",
      llamadasContestadas: 2,
      llamadasNoContestadas: 1,
      asesor: "Edson Mayta",
    },
    {
      codigo: "2",
      fechaCreacion: "2025-12-24",
      estado: "Calificado",
      llamadasContestadas: 2,
      llamadasNoContestadas: 1,
      asesor: "Edson Mayta",
    },
    {
      codigo: "3",
      fechaCreacion: "2025-12-24",
      estado: "Calificado",
      llamadasContestadas: 2,
      llamadasNoContestadas: 1,
      asesor: "Edson Mayta",
    },
    {
      codigo: "4",
      fechaCreacion: "2025-12-24",
      estado: "Calificado",
      llamadasContestadas: 2,
      llamadasNoContestadas: 1,
      asesor: "Edson Mayta",
    },
    {
      codigo: "5",
      fechaCreacion: "2025-12-24",
      estado: "Cliente",
      llamadasContestadas: 2,
      llamadasNoContestadas: 1,
      asesor: "Edson Mayta",
    },
    {
      codigo: "6",
      fechaCreacion: "2025-12-24",
      estado: "Calificado",
      llamadasContestadas: 2,
      llamadasNoContestadas: 1,
      asesor: "Edson Mayta",
    },
  ];

  const etapaColor = (etapa: string) => {
    const e = etapa.toLowerCase();
    if (["pendiente", "no calificado", "perdido"].includes(e)) return "#ff4d4f";
    if (["cliente"].includes(e)) return "#52c41a";
    if (["registrado", "calificado", "potencial", "promesa"].includes(e))
      return "#1677ff";
    return "#9ca3af";
  };

  const formattedDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <Row gutter={[16, 16]} style={{ padding: 16 }}>
      {/* === Columna izquierda === */}
      <Col xs={24} md={6}>
        <h2>Información del Cliente:</h2>
        <Card bordered style={{ marginBottom: 16 }}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            {infoCliente.map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 8 }}>
                <span style={{ fontWeight: 400 }}>{item.label}:</span>
                <span style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </Space>
        </Card>
        <Button
          type="primary"
          icon={<EditOutlined />}
          block
          style={{ backgroundColor: "#000", borderColor: "#000" }}
        >
          Editar
        </Button>
      </Col>

      {/* === Columna derecha === */}
      <Col
        xs={24}
        md={18}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {/* Card de botones */}
        <Card
          style={{
            backgroundColor: "#f1f5f998",
            margin: "0 auto",
            borderRadius: 12,
          }}
          bodyStyle={{ padding: 16 }}
        >
          <Space
            size={16}
            style={{
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Button
              type="primary"
              style={{ backgroundColor: "#000", borderColor: "#000" }}
            >
              Oportunidad actual
            </Button>
            <Button
              style={{
                backgroundColor: "#fff",
                borderColor: "#000",
                color: "#000",
              }}
            >
              Historial oportunidades{" "}
              <span style={{ color: "#3b82f6" }}>(5)</span>
            </Button>
          </Space>
        </Card>

        {/* Card de Oportunidad Actual */}
        <Card style={{ flex: 1 }}>
          <h3>Oportunidad Actual</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Contenedor con scroll interno */}
            <div
              style={{
                flex: 1,
                overflow: "auto",
                background: "#f9fafb",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <div style={{ minWidth: `${colMinWidth * 5}px` }}>
                {/* CABECERA */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(5, minmax(${colMinWidth}px, 1fr))`,
                    color: "#ffffffff",
                    borderRadius: 10,
                    padding: 10,
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    position: "sticky",
                    top: 0,
                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#000000ff",
                      fontWeight: 600,
                      gap: 6,
                      userSelect: "none",
                      minWidth: colMinWidth,
                    }}
                  >
                    <span style={{ fontSize: 13 }}>
                      {"Codigo de Lanzamiento"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#000000ff",
                      fontWeight: 600,
                      gap: 6,
                      userSelect: "none",
                      minWidth: colMinWidth,
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{"Fecha de Creación"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#000000ff",
                      fontWeight: 600,
                      gap: 6,
                      userSelect: "none",
                      minWidth: colMinWidth,
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{"Estado"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#000000ff",
                      fontWeight: 600,
                      gap: 6,
                      userSelect: "none",
                      minWidth: colMinWidth,
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{"Marcación"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#000000ff",
                      fontWeight: 600,
                      gap: 6,
                      userSelect: "none",
                      minWidth: colMinWidth,
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{"Asesor"}</span>
                  </div>
                </div>

                {/* FILA */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(5, minmax(${colMinWidth}px, 1fr))`,
                    gap: 8,
                    background: "#fff",
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 10,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Código */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{oportunidadActual.codigo}</span>
                    <Button
                      type="primary"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() =>
                        navigator.clipboard.writeText(oportunidadActual.codigo)
                      }
                      style={{
                        backgroundColor: "#1677ff",
                        borderColor: "#1677ff",
                      }}
                    />
                  </div>

                  {/* Fecha de creación */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {oportunidadActual.fechaCreacion}
                  </div>

                  {/* Estado */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        background: etapaColor(oportunidadActual.estado),
                        color: "#fff",
                        padding: "8px 0", // ocupa toda la anchura
                        borderRadius: 999,
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        width: "100%",
                      }}
                    >
                      {oportunidadActual.estado}
                    </div>
                  </div>

                  {/* Marcación */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {/* Llamadas contestadas */}
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        background: "#1677ff",
                        borderRadius: 4,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {oportunidadActual.llamadasContestadas}
                    </div>

                    {/* Llamadas no contestadas */}
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        background: "#ff4d4f",
                        borderRadius: 4,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {oportunidadActual.llamadasNoContestadas}
                    </div>
                  </div>

                  {/* Asesor */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {oportunidadActual.asesor}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Card
            style={{
              backgroundColor: "#f1f5f598",
              borderRadius: 12,
              padding: 4,
              marginTop: 16,
            }}
          >
            {/* Botón Agregar Control con icono en círculo */}
            <div style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                style={{
                  backgroundColor: "#000",
                  borderColor: "#000",
                }}
              >
                Agregar Control
              </Button>
            </div>

            {/* Input deshabilitado con icono azul y texto normal */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label
                htmlFor="urlBrochure"
                style={{ fontWeight: 600, color: "#111827" }}
              >
                URL Brochure
              </label>
              <Input
                id="urlBrochure"
                placeholder="https://ejemplo.com/brochure.pdf"
                prefix={<FileOutlined style={{ color: "#1677ff" }} />}
                value="https://ejemplo.com/brochure.pdf"
                disabled
                style={{
                  color: "#111827", // mantiene color de texto
                  backgroundColor: "#fff", // quita efecto gris apagado
                  cursor: "not-allowed",
                }}
              />
            </div>
          </Card>
          {/* Historial dividido en 2 columnas */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 16,
            }}
          >
            <Row gutter={[16, 16]}>
              {/* Columna izquierda - Historial de Estados */}
              <Col xs={24} md={12}>
                <h4 style={{ marginBottom: 8, fontWeight: 700 }}>
                  Historial de Estados (3)
                </h4>
                <Card
                  style={{
                    backgroundColor: "#f1f5f598",
                    borderRadius: 12,
                    padding: 2,
                    minHeight: 100,
                  }}
                >
                  {/* Botón Agregar Control con icono en círculo */}
                  <div style={{ marginBottom: 12 }}>
                    <Button
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      style={{
                        backgroundColor: "#000",
                        borderColor: "#000",
                      }}
                    >
                      Agregar Estado
                    </Button>
                  </div>
                  <TablaEstadosReducida />
                </Card>
              </Col>

              {/* Columna derecha - Historial de Interacción */}
              <Col xs={24} md={12}>
                <h4 style={{ marginBottom: 8, fontWeight: 700 }}>
                  Historial de Interacción (5)
                </h4>
                <Card
                  style={{
                    backgroundColor: "#f1f5f598",
                    borderRadius: 12,
                    minHeight: 100,
                  }}
                >
                  {/* Card de filtros */}
                  <Card
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      padding: 4, // espacio mínimo para el contenido
                      marginBottom: 12,
                    }}
                    bodyStyle={{ padding: 4 }} // reduce aún más el padding interno
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6, // espacio reducido entre los botones
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 13 }}>
                        Filtros:
                      </span>

                      <Button
                        type="default"
                        icon={<FileTextOutlined />}
                        style={{
                          backgroundColor: "#cfe8ff",
                          borderColor: "#cfe8ff",
                          color: "#0f1724",
                          fontWeight: 500,
                          padding: "2px 8px",
                          fontSize: 12,
                        }}
                      >
                        Notas
                      </Button>

                      <Button
                        type="default"
                        icon={<WhatsAppOutlined />}
                        style={{
                          backgroundColor: "#cfe8ff",
                          borderColor: "#cfe8ff",
                          color: "#0f1724",
                          fontWeight: 500,
                          padding: "2px 8px",
                          fontSize: 12,
                        }}
                      >
                        Envíos por WSP
                      </Button>

                      <Button
                        type="default"
                        icon={<BellOutlined />}
                        style={{
                          backgroundColor: "#cfe8ff",
                          borderColor: "#cfe8ff",
                          color: "#0f1724",
                          fontWeight: 500,
                          padding: "2px 8px",
                          fontSize: 12,
                        }}
                      >
                        Recordatorios
                      </Button>
                    </div>
                  </Card>

                  {/* Contenedor de cards de interacción con altura fija y scroll */}
<div
  style={{display: "flex", flexDirection: "column", gap: 8, marginTop: 12}}
>
  {interacciones.map((item, index) => {
    let bgColor = "#fff";
    if (item.tipo === "recordatorio") bgColor = "#f3f4f6";
    if (item.tipo === "wsp") bgColor = "#d1fae5";

    return (
      <Card
        key={index}
        size="small"
        style={{
          borderRadius: 8,
          backgroundColor: bgColor,
          padding: 8,
          textAlign: "right", // contenido alineado a la derecha
        }}
      >
        {item.tipo === "nota" && (
          <>
            <p style={{ margin: 0 }}>{item.mensaje}</p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
              {item.fecha} - {item.usuario}
            </p>
          </>
        )}

        {item.tipo === "wsp" && (
          <>
            <p style={{ margin: 0 }}>{item.telefono}</p>
            <p style={{ margin: 0 }}>{item.mensaje}</p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
              {item.fecha} - {item.usuario}
            </p>
          </>
        )}

        {item.tipo === "recordatorio" && (
          <>
            <p style={{ margin: 0 }}>{item.fechaRecordatorio}</p>
            <p style={{ margin: 0 }}>{item.mensaje}</p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
              {item.fecha} - {item.usuario}
            </p>
          </>
        )}
      </Card>
    );
  })}
</div>


                  {/* Contenedor final dividido en 2 */}
<div style={{ display: "flex", gap: 8, marginTop: 12 }}>
  {/* TextArea */}
  <Input.TextArea
    placeholder="Escribe un mensaje..."
    maxLength={100}
    autoSize={{ minRows: 3, maxRows: 5 }}
    style={{ flex: 1 }}
  />

  {/* Botones apilados */}
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <Button type="primary">Tipo</Button>
    <Button type="default" style={{ backgroundColor: "#d1d5db" }}>
      Enviar
    </Button>
  </div>
  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
