import { Typography, Row, Col, Space, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React from "react";

const { Text } = Typography;

// 🎨 Estilo base de botones tipo tag
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
  minWidth: 80,
  textAlign: "center" as const,
  display: "inline-block",
});

export default function EstadoPromesa() {
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
        <Space wrap>
          {[
            { label: "Registrado", base: "#C9C9C9", hover: "#BEBEBE" },
            { label: "Calificado", base: "#C9C9C9", hover: "#BEBEBE" },
            { label: "Potencial", base: "#9CBDFD", hover: "#86ACFB" },
            { label: "Promesa", base: "#9CBDFD", hover: "#86ACFB" },
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
          En esta etapa se pueden registrar oportunidades corporativas, ventas
          cruzadas o seguimientos.
        </Text>
      </div>

      {/* === Oportunidades === */}
      <Row gutter={8}>
        {[
          { label: "Corporativo", base: "#FFF6A3", hover: "#FFF08A" },
          { label: "Venta cruzada", base: "#FFF6A3", hover: "#FFF08A" },
          { label: "Seguimiento", base: "#FFF6A3", hover: "#FFF08A" },
        ].map((b, i) => (
          <Col span={8} key={i}>
            <div
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
          </Col>
        ))}
      </Row>

      {/* === Panel de Corporativo === */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Text strong style={{ color: "#0D0C11" }}>
          Corporativo
        </Text>

        <Row gutter={8} align="middle">
          <Col span={10}>
            <Text style={{ color: "#0D0C11", fontSize: 13 }}>
              Selecciona un producto
            </Text>
          </Col>
          <Col span={14}>
            <Select
              placeholder="Seleccione..."
              style={{ width: "100%" }}
              options={[
                { value: "powerbi", label: "Power BI" },
                { value: "excel", label: "Excel Empresarial" },
                { value: "gestion", label: "Gestión de proyectos" },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={8} align="middle">
          <Col span={10}>
            <Text style={{ color: "#0D0C11", fontSize: 13 }}>
              Selecciona fase
            </Text>
          </Col>
          <Col span={14}>
            <Select
              placeholder="Seleccione..."
              style={{ width: "100%" }}
              options={[
                { value: "contacto", label: "Contacto inicial" },
                { value: "cotizacion", label: "Cotización" },
                { value: "negociacion", label: "Negociación" },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={8} align="middle">
          <Col span={10}>
            <Text style={{ color: "#0D0C11", fontSize: 13 }}>
              Selecciona empresa
            </Text>
          </Col>
          <Col span={14}>
            <Select
              placeholder="Seleccione..."
              style={{ width: "100%" }}
              options={[
                { value: "acme", label: "ACME Corp." },
                { value: "globex", label: "Globex" },
                { value: "initech", label: "Initech" },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={8} align="middle">
          <Col span={10}>
            <Text style={{ color: "#0D0C11", fontSize: 13 }}>
              Selecciona cantidad
            </Text>
          </Col>
          <Col span={14}>
            <Select
              placeholder="Seleccione..."
              style={{ width: "100%" }}
              options={[
                { value: "1-5", label: "1 a 5" },
                { value: "6-10", label: "6 a 10" },
                { value: "10+", label: "Más de 10" },
              ]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
