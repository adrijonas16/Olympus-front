import React, { useState, useEffect } from "react";
import { Card, Divider, Space, Typography, Row, Col, Modal, Button, Spin, Alert } from "antd";
import { LinkedinOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import InformacionProducto from "./InformacionProducto";

const { Text, Title } = Typography;

interface PotencialData {
  id?: number;
  idPersona?: number;
  desuscrito?: boolean;
  estado?: boolean;
  persona?: {
    id?: number;
    idPais?: number;
    pais?: string;
    nombres?: string;
    apellidos?: string;
    celular?: string;
    prefijoPaisCelular?: string;
    correo?: string;
    areaTrabajo?: string;
    industria?: string;
  };
}

const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLinkedInOpen, setIsLinkedInOpen] = useState(false);
  const [potencialData, setPotencialData] = useState<PotencialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const linkedinUrl = "https://www.linkedin.com/in/adriana-chipana-ampuero-b42019117/";
  const tabs = ["Producto actual", "Productos del área", "Otras áreas"];
  const detalles = [
    ["Nombre producto:", "Power BI"],
    ["Código Lanzamiento:", "imbjdhsajklhdsakjlda"],
    ["Fecha de inicio:", "21-09-2025"],
    ["Fecha presentación:", "21-09-2025"],
  ];

  useEffect(() => {
    console.log('🔷 ClienteProducto - ID de oportunidad recibido:', id);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRyaWFuYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpcCI6InN0cmluZyIsImV4cCI6MTc2MzQwNzMwOSwiaXNzIjoiT2x5bXB1c0FQSSIsImF1ZCI6Ik9seW1wdXNVc2VycyJ9.sNibBa3IbPv6MgLhF5Gq3Wb7up5qlsTE6i4iBRszsS4";

    if (!id) {
      console.warn('⚠️ No hay ID de oportunidad disponible');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    console.log('🔷 ClienteProducto - Haciendo petición a:', `/api/VTAModVentaOportunidad/ObtenerPotencialPorOportunidad/${id}`);

    axios
      .get(`/api/VTAModVentaOportunidad/ObtenerPotencialPorOportunidad/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log('🔷 ClienteProducto - Potencial Data recibida:', res.data);
        setPotencialData(res.data);
      })
      .catch((err) => {
        console.error('🔷 ClienteProducto - Error en la petición:', err);
        console.error('🔷 ClienteProducto - Detalles del error:', err.response?.data);
        setError("Error al obtener los datos del cliente");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%", padding: 16 }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  const persona = potencialData?.persona;

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
  styles={{ body: { padding: 0 } }}
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
    {persona && [
      ["Nombre", persona.nombres || "-"],
      ["Apellidos", persona.apellidos || "-"],
      ["Teléfono", persona.celular || "-"],
      ["País", persona.pais || "-"],
      ["Prefijo País", persona.prefijoPaisCelular || "-"],
      ["Correo", persona.correo || "-"],
      ["Área de trabajo", persona.areaTrabajo || "-"],
      ["Desuscrito", potencialData?.desuscrito ? "Sí" : "No"],
      ["Industria", persona.industria || "-"],
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
