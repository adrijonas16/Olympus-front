import React, { useEffect, useState } from "react";
import { Card, Button, Spin, Alert } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";

const colMinWidth = 150;

const etapaColor = (etapa: string) => {
    const e = etapa.toLowerCase();
    if (["pendiente", "no calificado", "perdido"].includes(e)) return "#ff4d4f";
    if (["cliente"].includes(e)) return "#52c41a";
    if (["registrado", "calificado", "potencial", "promesa"].includes(e))
      return "#1677ff";
    return "#9ca3af";
  };

export default function OportunidadActual({ id }: { id?: string }) {
  const [loading, setLoading] = useState(true);
  const [oportunidad, setOportunidad] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token || !id) return;

    setLoading(true);
    setError(null);

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/VTAModVentaOportunidad/Detalle/PorId/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setOportunidad(res.data))
      .catch((err) => {
        console.error(err);
        setError("Error al obtener la oportunidad");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin tip="Cargando oportunidad..." />;
  if (error) return <Alert message={error} type="error" showIcon />;
  if (!oportunidad) return <Alert message="No se encontró la oportunidad" type="info" />;

  const { codigoLanzamiento, fechaCreacion, historialEstado } = oportunidad;

  const estado = historialEstado?.estadoReferencia?.nombre || "Desconocido";
  const llamadasContestadas = historialEstado?.cantidadLlamadasContestadas ?? 0;
  const llamadasNoContestadas = historialEstado?.cantidadLlamadasNoContestadas ?? 0;
  const asesor = historialEstado?.asesor
    ? `${historialEstado.asesor.nombres} ${historialEstado.asesor.apellidos}`
    : "Sin asesor";

  const fecha = new Date(fechaCreacion).toLocaleString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card style={{ flex: 1 }}>
      <h3>Oportunidad Actual</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
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
                gridTemplateColumns: `repeat(5, minmax(${colMinWidth}px, 1fr))`,
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              {[
                "Código de Lanzamiento",
                "Fecha de Creación",
                "Estado",
                "Marcación",
                "Asesor",
              ].map((header) => (
                <div
                  key={header}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000",
                    fontWeight: 600,
                    fontSize: 13,
                    minWidth: colMinWidth,
                  }}
                >
                  {header}
                </div>
              ))}
            </div>

            {/* FILA */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(5, minmax(${colMinWidth}px, 1fr))`,
                gap: 8,
                background: "#fff",
                borderRadius: 10,
                padding: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                alignItems: "center",
              }}
            >
              {/* Código */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{codigoLanzamiento}</span>
                <Button
                  type="primary"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => navigator.clipboard.writeText(codigoLanzamiento)}
                  style={{
                    backgroundColor: "#1677ff",
                    borderColor: "#1677ff",
                  }}
                />
              </div>

              {/* Fecha */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {fecha}
              </div>

              {/* Estado */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: etapaColor(estado),
                    color: "#fff",
                    padding: "8px 0",
                    borderRadius: 999,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 13,
                    width: "100%",
                  }}
                >
                  {estado}
                </div>
              </div>

              {/* Marcación */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    background: "#1677ff",
                    borderRadius: 4,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {llamadasContestadas}
                </div>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    background: "#ff4d4f",
                    borderRadius: 4,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {llamadasNoContestadas}
                </div>
              </div>

              {/* Asesor */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {asesor}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
