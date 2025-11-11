import React, { useState } from "react";
import { Card, Divider, Space, Typography, Row, Col, Modal, Button } from "antd";
import { LinkedinOutlined } from "@ant-design/icons";
import InformacionProducto from "./InformacionProducto";

const { Text, Title } = Typography;

const ProductoDetalle: React.FC = () => {
  const [isLinkedInOpen, setIsLinkedInOpen] = useState(false);
  const linkedinUrl = "https://www.linkedin.com/in/adriana-chipana-ampuero-b42019117/";
  const tabs = ["Producto actual", "Productos del área", "Otras áreas"];
  const detalles = [
    ["Nombre producto:", "Power BI"],
    ["Código Lanzamiento:", "imbjdhsajklhdsakjlda"],
    ["Fecha de inicio:", "21-09-2025"],
    ["Fecha presentación:", "21-09-2025"],
  ];

  return (
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      <Title level={5} style={{ margin: 0, color: "#252C35" }}>
        Información del Cliente
      </Title>

<Card
  style={{
    width: "100%",
    padding: 16,
    background: "#F0F0F0",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "inset 1px 1px 4px rgba(0,0,0,0.25)", // ← sombra interna
  }}
  bodyStyle={{ padding: 0 }}
>
  <div
    style={{
      background: "#FFFFFF",
      borderRadius: 16,
      padding: 8,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      border: "1px solid #DCDCDC", // mantiene el borde del contenido blanco
    }}
  >
    {[
      ["Nombre", "Edson"],
      ["Apellidos", "Mayta Escobedo"],
      ["Teléfono", "960051787"],
      ["País", "Perú"],
      ["Prefijo País", "51"],
      ["Correo", "dani_21@gmail.com"],
      ["Área de trabajo", "-"],
      ["Desuscrito", "-"],
      ["Industria", "-"],
    ].map(([label, value], i) => (
      <div
        key={i}
        style={{ display: "flex", gap: 8, alignItems: "center" }}
      >
        <div
          style={{ color: "#676767", fontSize: 14, fontWeight: 300 }}
        >
          {label}:
        </div>
        <div
          style={{ color: "rgba(0,0,0,0.85)", fontSize: 16, fontWeight: 400 }}
        >
          {value}
        </div>
      </div>
    ))}
  </div>

  <div style={{ display: "flex", gap: 12 }}>
    <div
      style={{
        flex: 1,
        padding: "2px 12px",
        background: "#252C35",
        borderRadius: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#FFFFFF",
        cursor: "pointer",
      }}
    >
      Editar
    </div>

    <div
      style={{
        flex: 2,
        padding: "2px 12px",
        background: "#252C35",
        borderRadius: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        color: "#FFFFFF",
        cursor: "pointer",
      }}
      onClick={() => setIsLinkedInOpen(true)}
    >
      <LinkedinOutlined />
      <div style={{ fontSize: 12 }}>Información de LinkedIn</div>
    </div>
  </div>
</Card>


      {/* Modal con preview */}
<Modal
  title="Información de LinkedIn"
  open={isLinkedInOpen}
  onCancel={() => setIsLinkedInOpen(false)}
  footer={null}
  width={700}
>
  <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
    <div style={{ marginBottom: 16 }}>
      <input
        value="Edson Mayta Escobedo LinkedIn"
        readOnly
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 24,
          border: "1px solid #ccc",
          fontSize: 14,
        }}
      />
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <a
          href="https://www.linkedin.com/in/edson-mayta-escobedo"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 16, color: "#1a0dab", textDecoration: "none" }}
        >
          Edson Mayta Escobedo | LinkedIn
        </a>
        <div style={{ fontSize: 14, color: "#006621" }}>
          linkedin.com/in/edson-mayta-escobedo
        </div>
        <div style={{ fontSize: 13, color: "#4d5156" }}>
          Perfil profesional de Edson Mayta Escobedo, especialista en Power BI y análisis de datos.
        </div>
      </div>

      <div>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 16, color: "#1a0dab", textDecoration: "none" }}
        >
          Más resultados de LinkedIn
        </a>
      </div>

      <Button
        style={{ alignSelf: "center", marginTop: 12 }}
        onClick={() =>
          window.open(
            `https://www.google.com/search?q=${encodeURIComponent(
              "Edson Mayta Escobedo LinkedIn"
            )}`,
            "_blank"
          )
        }
      >
        Ver búsqueda completa en Google
      </Button>
    </div>
  </div>
</Modal>


<InformacionProducto />
    </div>
  );
};

export default ProductoDetalle;
