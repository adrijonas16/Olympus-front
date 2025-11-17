import { Card, Space, Typography, Tag } from "antd";
import HistorialInteracciones from "./HistorialInterraciones";

const { Text, Title } = Typography;

export default function HistorialInteraccion() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 8, // reducido de 10 a 8
      }}
    >
      {/* === Título principal === */}
      <Title level={5} style={{ margin: 0, color: "#252C35" }}>
        Oportunidad actual
      </Title>

      {/* === Contenedor general sin fondo plomo === */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2, // se mantiene en 2
        }}
      >
        {/* === Bloque con borde plomo y sombra === */}
        <div
          style={{
            background: "#F0F0F0",
            borderRadius: 4,
            padding: 1.5, // reducido de 2 a 1.5
            boxShadow: "inset 1px 1px 4px rgba(0,0,0,0.25)",
            border: "1px solid #DCDCDC",
          }}
        >
          {/* === Contenido blanco interior === */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 4,
              border: "1px solid #DCDCDC",
              padding: 1.5, // reducido de 2 a 1.5
              display: "flex",
              flexDirection: "column",
              gap: 0, // sin gap
            }}
          >
            {/* Código lanzamiento */}
            <Space size={4}>
              <Text style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}>
                Código lanzamiento:
              </Text>
              <Text style={{ color: "#0D0C11", fontSize: 14 }}>
                imbtainmejcontmtto06251
              </Text>
            </Space>

            {/* Fecha de formulario */}
            <Space size={4}>
              <Text style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}>
                Fecha de formulario:
              </Text>
              <Text style={{ color: "#010101", fontSize: 14 }}>20-09-2025</Text>
            </Space>

            {/* Fecha de creación */}
            <Space size={4}>
              <Text style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}>
                Fecha de creación:
              </Text>
              <Text style={{ color: "rgba(0,0,0,0.85)", fontSize: 14 }}>
                01-10-2025
              </Text>
            </Space>

            {/* Estado */}
            <Space size={4} align="center">
              <Text
                style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}
              >
                Estado:
              </Text>
              <Tag
                style={{
                  background: "#BAD4FF",
                  color: "#000",
                  fontSize: 12,
                  borderRadius: 4,
                  padding: "0 10px",
                }}
              >
                Registrado
              </Tag>
            </Space>

            {/* Marcaciones */}
            <Space size={4} align="center">
              <Text
                style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}
              >
                Marcaciones:
              </Text>
              <Tag
                style={{
                  background: "#FFCDCD",
                  color: "#000",
                  fontSize: 12,
                  borderRadius: 4,
                  padding: "0 8px",
                }}
              >
                3
              </Tag>
            </Space>

            {/* Asesor */}
            <Space size={4}>
              <Text style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}>
                Asesor:
              </Text>
              <Text style={{ color: "#0D0C11", fontSize: 14 }}>
                Fernando Ibarra
              </Text>
            </Space>

            {/* Otras oportunidades */}
            <Space size={4}>
              <Text style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}>
                Otras oportunidades:
              </Text>
              <Text
                style={{ color: "#005FF8", fontSize: 14, fontWeight: 500 }}
              >
                6
              </Text>
            </Space>

            {/* Origen */}
            <Space size={4} align="center">
              <Text
                style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}
              >
                Origen:
              </Text>
              <div
                style={{
                  borderRadius: 4,
                  outline: "0.5px solid #0D0C11",
                  padding: 1,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "#25D366",
                    borderRadius: 4,
                    padding: "2px 6px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      background: "#FFFFFF",
                      borderRadius: 2,
                    }}
                  />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    WhatsApp
                  </Text>
                </div>
              </div>
            </Space>
          </div>
        </div>
      </div>

      {/* === Historial de interacciones === */}
      <HistorialInteracciones />
    </div>
  );
}
