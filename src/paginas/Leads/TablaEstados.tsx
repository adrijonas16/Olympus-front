import React, { useState } from "react";
import { Card, Row, Col, Select, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CallProgressBar from "../../componentes/CallProgressBar";

const { TextArea } = Input;
const colMinWidth = 120; // ancho base reducido
const idColWidth = 60; // ID más estrecha

const ejemploEstados = [
  {
    codigo: 123456,
    fechaCreacion: "24-12-2025 23:00",
    estado: "Calificado",
    llamadasContestadas: 2,
    llamadasNoContestadas: 1,
    asesor: "Edson Mayta",
  },
  {
    codigo: 123457,
    fechaCreacion: "25-12-2025 10:30",
    estado: "Pendiente",
    llamadasContestadas: 0,
    llamadasNoContestadas: 1,
    asesor: "María Pérez",
  },
];

export default function TablaEstadosReducida() {
  const [oportunidadActual2, setOportunidadActual2] = useState(ejemploEstados);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleRow = (codigo: number) => {
    setExpandedId(expandedId === codigo ? null : codigo);
  };

  const etapaColor = (etapa: string) => {
    const e = etapa.toLowerCase();
    if (["pendiente", "no calificado", "perdido"].includes(e)) return "#ff4d4f";
    if (["cliente"].includes(e)) return "#52c41a";
    if (["registrado", "calificado", "potencial", "promesa"].includes(e))
      return "#1677ff";
    return "#9ca3af";
  };

  return (
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
            gridTemplateColumns: `${idColWidth}px repeat(4, minmax(${colMinWidth}px, 1fr))`,
            background: "#0f1724",
            color: "#fff",
            borderRadius: 10,
            padding: 6,
            alignItems: "center",
            gap: 4,
            marginBottom: 6,
            position: "sticky",
            top: 0,
            zIndex: 5,
            fontSize: 12,
          }}
        >
          <div style={{ textAlign: "center" }}>ID</div>
          <div style={{ textAlign: "center" }}>Fecha de Creación</div>
          <div style={{ textAlign: "center" }}>Estado</div>
          <div style={{ textAlign: "center" }}>Marcación</div>
          <div style={{ textAlign: "center" }}>Asesor</div>
        </div>

        {/* FILAS */}
        {oportunidadActual2.map((item) => {
          const isExpanded = expandedId === item.codigo;
          return (
            <div key={item.codigo}>
              <div
                onClick={() => toggleRow(item.codigo)}
                style={{
                  display: "grid",
                  gridTemplateColumns: `${idColWidth}px repeat(4, minmax(${colMinWidth}px, 1fr))`,
                  alignItems: "center",
                  gap: 4,
                  background: "#fff",
                  borderRadius: 8,
                  padding: 8,
                  marginBottom: 4,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: isExpanded ? 700 : 500,
                  border: isExpanded ? "2px solid #1677ff" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ textAlign: "center" }}>{item.codigo}</div>
                <div style={{ textAlign: "center" }}>{item.fechaCreacion}</div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      background: etapaColor(item.estado),
                      color: "#fff",
                      padding: "4px 6px",
                      borderRadius: 999,
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {item.estado}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      background: "#1677ff",
                      borderRadius: 4,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item.llamadasContestadas}
                  </div>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      background: "#ff4d4f",
                      borderRadius: 4,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item.llamadasNoContestadas}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>{item.asesor}</div>
              </div>

              {isExpanded && (
                <Card
                  style={{
                    backgroundColor: "#f1f5f598",
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 8,
                  }}
                >
                  <Row gutter={16}>
                    {/* Izquierda: Motivo y Observacion */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: 8 }}>
                        <label style={{ fontWeight: 600, fontSize: 12 }}>
                          <ExclamationCircleOutlined
                            style={{ marginRight: 4, color: "#1677ff" }}
                          />
                          Motivo
                        </label>
                        <Select
                          placeholder="Seleccionar motivo"
                          style={{ width: "100%", fontSize: 12 }}
                          options={[
                            { value: "motivo1", label: "Motivo 1" },
                            { value: "motivo2", label: "Motivo 2" },
                          ]}
                        />
                      </div>

                      <div>
                        <label style={{ fontWeight: 600, fontSize: 12 }}>
                          <ExclamationCircleOutlined
                            style={{ marginRight: 4, color: "#1677ff" }}
                          />
                          Observación
                        </label>
                        <TextArea rows={3} style={{ fontSize: 12 }} />
                      </div>
                    </Col>

                    {/* Derecha: CallProgressBar */}
                    <Col xs={24} md={12}>
                      <CallProgressBar />
                    </Col>
                  </Row>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
