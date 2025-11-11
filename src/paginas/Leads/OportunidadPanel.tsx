import React from "react";
import { Card, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import HistorialEstados from "./HistorialEstados";

const { Title, Text } = Typography;

const ValidacionFase: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* === Título principal === */}
      <Title level={5} style={{ margin: 0, color: "#252C35" }}>
        Validación de fase
      </Title>

      {/* === Contenedor gris con sombra que abarca todo === */}
      <Card
        style={{
          width: "100%",
          background: "#F0F0F0",
          borderRadius: 8,
          border: "1px solid #DCDCDC",
          boxShadow: "inset 1px 1px 4px rgba(0,0,0,0.25)",
        }}
        bodyStyle={{
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {["Debes Validar", "Preguntas de fase", "Personalidad del cliente"].map(
          (texto) => (
            <div
              key={texto}
              style={{
                background: "#FFFFFF",
                border: "1px solid #DCDCDC",
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Text
                style={{
                  color: "rgba(0, 0, 0, 0.85)",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                {texto}
              </Text>
              <RightOutlined
                style={{ color: "rgba(194,194,194,0.85)", fontSize: 12 }}
              />
            </div>
          )
        )}
      </Card>

      {/* === Sección independiente: Historial de estados === */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Title level={5} style={{ margin: 0, color: "#252C35" }}>
          Historial de estados
        </Title>
        <Card
          size="small"
          style={{
            background: "#F0F0F0",
            borderRadius: 8,
            border: "1px solid #DCDCDC",
            boxShadow: "inset 1px 1px 3px rgba(0, 0, 0, 0.25)",
          }}
          bodyStyle={{ padding: 12 }}
        >
          <HistorialEstados />
        </Card>
      </div>
    </div>
  );
};

export default ValidacionFase;
