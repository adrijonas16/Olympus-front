import { Typography, Row, Space } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React from "react";

const { Text } = Typography;

// === Estilo base para los botones ===
const buttonStyle = (baseColor: string, hoverColor: string): React.CSSProperties => ({
  background: baseColor,
  color: "#0D0C11",
  border: "none",
  borderRadius: 6,
  padding: "4px 12px",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  boxShadow: "0 1.5px 4px rgba(0, 0, 0, 0.15)",
  transition: "all 0.2s ease",
  userSelect: "none",
  minWidth: 90,
  textAlign: "center" as const,
  display: "inline-block",
});

export default function EstadoNoCalificado() {
  return (
    <div
      style={{
        background: "#F5F5F5",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* === Ocurrencia === */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 14, color: "#0D0C11" }}>Ocurrencia:</Text>
        <Space>
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
      </Row>

      {/* === Info adicional === */}
      <div
        style={{
          background: "#ECECEC",
          borderRadius: 10,
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <InfoCircleOutlined style={{ color: "#5D5D5D" }} />
        <Text style={{ fontSize: 12, color: "#5D5D5D" }}>
          El cliente no calificó para continuar el proceso o decidió no seguir
          con la oferta.
        </Text>
      </div>
    </div>
  );
}
