import React from "react";
import { Card, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

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
  // Datos de ejemplo
  const codigoLanzamiento = "RH2506";
  const fechaCreacion = "2025-12-24";
  const estado = "Calificado";
  const llamadasContestadas = 2;
  const llamadasNoContestadas = 1;
  const asesor = "Edson Mayta";

  const fecha = new Date(fechaCreacion).toLocaleString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 12 }}>Oportunidad Actual</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
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
