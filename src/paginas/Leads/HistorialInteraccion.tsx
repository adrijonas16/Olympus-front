import { Card, Space, Typography, Tag, Spin, Alert } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import HistorialInteracciones from "./HistorialInterraciones";

const { Text, Title } = Typography;

interface OportunidadDetalle {
  oportunidad: Array<{
    id: number;
    codigoLanzamiento: string;
    fechaCreacion: string;
    totalOportunidadesPersona: number;
    origen: string | null;
  }>;
  historialActual: Array<{
    id: number;
    cantidadLlamadasContestadas: number;
    cantidadLlamadasNoContestadas: number;
    asesor: {
      nombres: string;
      apellidos: string;
    };
    estadoReferencia: {
      nombre: string;
    };
  }>;
}

export default function HistorialInteraccion() {
  const { id } = useParams<{ id: string }>();
  const [oportunidad, setOportunidad] = useState<OportunidadDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRyaWFuYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpcCI6InN0cmluZyIsImV4cCI6MTc2MzQwNzMwOSwiaXNzIjoiT2x5bXB1c0FQSSIsImF1ZCI6Ik9seW1wdXNVc2VycyJ9.sNibBa3IbPv6MgLhF5Gq3Wb7up5qlsTE6i4iBRszsS4";
    if (!token || !id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Obtener detalles de la oportunidad
    axios.get(
      `/api/VTAModVentaOportunidad/ObtenerDetallePorId/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        console.log('Detalles de la oportunidad:', res.data);
        setOportunidad(res.data);
      })
      .catch((err) => {
        console.error('Error al obtener detalles:', err);
        setError("Error al obtener los datos de la oportunidad");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!oportunidad || !oportunidad.oportunidad || oportunidad.oportunidad.length === 0) {
    return <Alert message="No se encontró la oportunidad" type="info" showIcon />;
  }

  const oportunidadData = oportunidad.oportunidad[0];
  const historialActualData = oportunidad.historialActual && oportunidad.historialActual.length > 0
    ? oportunidad.historialActual[0]
    : null;

  const codigoLanzamiento = oportunidadData.codigoLanzamiento || "-";
  const fechaFormulario = "-"; // No viene en la API
  const fechaCreacion = oportunidadData.fechaCreacion || "-";
  const estado = historialActualData?.estadoReferencia?.nombre || "Desconocido";
  const marcaciones = (historialActualData?.cantidadLlamadasContestadas || 0) + (historialActualData?.cantidadLlamadasNoContestadas || 0);
  const asesor = historialActualData?.asesor
    ? `${historialActualData.asesor.nombres} ${historialActualData.asesor.apellidos}`
    : "Sin asesor";
  const cantidadOportunidades = oportunidadData.totalOportunidadesPersona || 0;
  const origen = oportunidadData.origen || "WhatsApp";

  const formatearFecha = (fecha: string) => {
    if (!fecha || fecha === "-") return "-";
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

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
        Oportunidad actual
      </Title>

      {/* === Contenedor general sin fondo plomo === */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
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
              padding: 4,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {/* Código lanzamiento */}
            <Space size={4}>
              <Text style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}>
                Código lanzamiento:
              </Text>
              <Text style={{ color: "#0D0C11", fontSize: 14 }}>
                {codigoLanzamiento}
              </Text>
            </Space>

            {/* Fecha de formulario */}
            <Space size={4}>
              <Text style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}>
                Fecha de formulario:
              </Text>
              <Text style={{ color: "#010101", fontSize: 14 }}>{formatearFecha(fechaFormulario)}</Text>
            </Space>

            {/* Fecha de creación */}
            <Space size={4}>
              <Text style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}>
                Fecha de creación:
              </Text>
              <Text style={{ color: "rgba(0,0,0,0.85)", fontSize: 14 }}>
                {formatearFecha(fechaCreacion)}
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
                {estado}
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
                {marcaciones}
              </Tag>
            </Space>

            {/* Asesor */}
            <Space size={4}>
              <Text style={{ color: "#676767", fontSize: 13, fontWeight: 300 }}>
                Asesor:
              </Text>
              <Text style={{ color: "#0D0C11", fontSize: 14 }}>
                {asesor}
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
                {cantidadOportunidades}
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
                    {origen || "WhatsApp"}
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
