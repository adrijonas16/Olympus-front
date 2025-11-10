import { Typography, Row, Col, Space } from "antd";
import React from "react";

const { Text } = Typography;

// 🎨 Estilo base de botones
const buttonStyle = (baseColor: string, hoverColor: string): React.CSSProperties => ({
  background: baseColor,
  color: "#0D0C11",
  border: "none",
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  boxShadow: "0 1.5px 4px rgba(0, 0, 0, 0.15)",
  transition: "all 0.2s ease",
  userSelect: "none",
  minWidth: 80,
  textAlign: "center" as const,
  display: "inline-block",
});

export default function EstadoPotencial() {
  return (
    <div
      style={{
        background: "#F0F0F0",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* === ¿Contestó? === */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 14, color: "#0D0C11" }}>¿Contestó?</Text>
        <Space>
          <div
            style={buttonStyle("#BAD4FF", "#A8C7FF")}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#A8C7FF")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#BAD4FF")
            }
          >
            Sí
          </div>
          <div
            style={buttonStyle("#FFCDCD", "#F5BDBD")}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#F5BDBD")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#FFCDCD")
            }
          >
            No
          </div>
        </Space>
      </Row>

      {/* === Ocurrencia === */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 14, color: "#0D0C11" }}>Ocurrencia:</Text>
        <Space>
          <div
            style={{
              width: 12,
              height: 12,
              background: "#5D5D5D",
              borderRadius: 2,
            }}
          />
          <Text style={{ fontSize: 11, color: "#5D5D5D" }}>Más información</Text>
        </Space>
      </Row>

      {/* === Etapas === */}
      <Row gutter={8}>
        {/* Columna Izquierda */}
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 8,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={8}>
                {[
                  { label: "Registrado", base: "#C9C9C9", hover: "#BEBEBE" },
                  { label: "Calificado", base: "#C9C9C9", hover: "#BEBEBE" },
                  { label: "Potencial", base: "#C9C9C9", hover: "#BEBEBE" },
                  { label: "Promesa", base: "#9CBDFD", hover: "#86ACFB" },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={buttonStyle(b.base, b.hover)}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = b.hover)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = b.base)
                    }
                  >
                    {b.label}
                  </div>
                ))}
              </Space>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 8,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={8}>
                {[
                  { label: "Corporativo", base: "#FFF6A3", hover: "#FFF08A" },
                  { label: "Venta cruzada", base: "#FFF6A3", hover: "#FFF08A" },
                  { label: "Seguimiento", base: "#FFF6A3", hover: "#FFF08A" },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={buttonStyle(b.base, b.hover)}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = b.hover)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = b.base)
                    }
                  >
                    {b.label}
                  </div>
                ))}
              </Space>
            </div>
          </Space>
        </Col>

        {/* Columna Derecha */}
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 8,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={8}>
                {[
                  { label: "Cobranza", base: "#B8F3B8", hover: "#A7E8A7" },
                  { label: "Convertido", base: "#B8F3B8", hover: "#A7E8A7" },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={buttonStyle(b.base, b.hover)}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = b.hover)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = b.base)
                    }
                  >
                    {b.label}
                  </div>
                ))}
              </Space>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 8,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={8}>
                {[
                  { label: "No calificado", base: "#F7B1B1", hover: "#F29C9C" },
                  { label: "Perdido", base: "#F7B1B1", hover: "#F29C9C" },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={buttonStyle(b.base, b.hover)}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = b.hover)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = b.base)
                    }
                  >
                    {b.label}
                  </div>
                ))}
              </Space>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
