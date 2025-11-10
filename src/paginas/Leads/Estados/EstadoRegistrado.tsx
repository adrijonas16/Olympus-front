import { Typography, Row, Col, Space } from "antd";

const { Text } = Typography;

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
  textAlign: "center" as const, // 👈 <- aquí el cast resuelve el error
  display: "inline-block",
});


export default function EstadoRegistrado() {
  return (
    <div
      style={{
        background: "#F0F0F0",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* === ¿Contestó? === */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 14, color: "#0D0C11" }}>¿Contestó?</Text>
        <Space>
          <div
            style={buttonStyle("#E4E4E4", "#D8D8D8")}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#D8D8D8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#E4E4E4")
            }
          >
            Sí
          </div>
          <div
            style={buttonStyle("#E4E4E4", "#D8D8D8")}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#D8D8D8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#E4E4E4")
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

      {/* === Categorías === */}
      <Row gutter={8}>
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={8}>
                <div
                  style={buttonStyle("#C9C9C9", "#BEBEBE")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#BEBEBE")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#C9C9C9")
                  }
                >
                  Registrado
                </div>
                <div
                  style={buttonStyle("#C9C9C9", "#BEBEBE")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#BEBEBE")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#C9C9C9")
                  }
                >
                  Calificado
                </div>
                <div
                  style={buttonStyle("#9CBDFD", "#86ACFB")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#86ACFB")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#9CBDFD")
                  }
                >
                  Potencial
                </div>
                <div
                  style={buttonStyle("#9CBDFD", "#86ACFB")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#86ACFB")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#9CBDFD")
                  }
                >
                  Promesa
                </div>
              </Space>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={8}>
                <div
                  style={buttonStyle("#FFF6A3", "#FFF08A")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#FFF08A")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#FFF6A3")
                  }
                >
                  Corporativo
                </div>
                <div
                  style={buttonStyle("#FFF6A3", "#FFF08A")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#FFF08A")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#FFF6A3")
                  }
                >
                  Venta cruzada
                </div>
                <div
                  style={buttonStyle("#FFF6A3", "#FFF08A")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#FFF08A")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#FFF6A3")
                  }
                >
                  Seguimiento
                </div>
              </Space>
            </div>
          </Space>
        </Col>

        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={8}>
                <div
                  style={buttonStyle("#B8F3B8", "#A7E8A7")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#A7E8A7")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#B8F3B8")
                  }
                >
                  Cobranza
                </div>
                <div
                  style={buttonStyle("#B8F3B8", "#A7E8A7")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#A7E8A7")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#B8F3B8")
                  }
                >
                  Convertido
                </div>
              </Space>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={8}>
                <div
                  style={buttonStyle("#F7B1B1", "#F29C9C")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F29C9C")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F7B1B1")
                  }
                >
                  No calificado
                </div>
                <div
                  style={buttonStyle("#F7B1B1", "#F29C9C")}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F29C9C")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#F7B1B1")
                  }
                >
                  Perdido
                </div>
              </Space>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
