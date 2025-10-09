import React, { useEffect, useState } from "react";
import { CalendarOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type Lead = {
  id: number;
  nombre: string;
  pais: string;
  programa: string;
  fechaISO: string;
  hora?: string;
  etapa: string;
  recordatorios?: { fecha: string; hora?: string }[];
};

const leads: Lead[] = [
  // === PROCESO DE VENTA ===
  {
    id: 1,
    nombre: "Edson Mayta Escobedo",
    pais: "Perú",
    programa: "RH 25 06",
    fechaISO: "2025-12-24",
    hora: "23:00",
    etapa: "Registrado",
    recordatorios: [
      { fecha: "2025-10-10", hora: "10:00" },
      { fecha: "2025-10-15", hora: "15:30" },
    ],
  },
  {
    id: 2,
    nombre: "Carla Paredes",
    pais: "México",
    programa: "RH 20 09",
    fechaISO: "2025-11-04",
    hora: "09:30",
    etapa: "Registrado",
  },
  {
    id: 3,
    nombre: "Lucía Fernández",
    pais: "Chile",
    programa: "IT 30 08",
    fechaISO: "2025-11-15",
    hora: "11:00",
    etapa: "Calificado",
    recordatorios: [{ fecha: "2025-11-20", hora: "10:00" }],
  },
  {
    id: 4,
    nombre: "Rodrigo Torres",
    pais: "Perú",
    programa: "RH 25 12",
    fechaISO: "2025-12-05",
    hora: "16:00",
    etapa: "Calificado",
  },
  {
    id: 5,
    nombre: "Martha Castillo",
    pais: "Ecuador",
    programa: "IT 19 07",
    fechaISO: "2025-12-02",
    hora: "14:30",
    etapa: "Potencial",
    recordatorios: [
      { fecha: "2025-12-10", hora: "09:00" },
      { fecha: "2025-12-12", hora: "09:30" },
    ],
  },
  {
    id: 6,
    nombre: "Gonzalo Rojas",
    pais: "Colombia",
    programa: "RH 22 04",
    fechaISO: "2025-10-29",
    hora: "12:00",
    etapa: "Potencial",
  },
  {
    id: 7,
    nombre: "Daniela Jiménez",
    pais: "Argentina",
    programa: "IT 15 03",
    fechaISO: "2025-10-22",
    hora: "10:00",
    etapa: "Promesa",
    recordatorios: [{ fecha: "2025-10-23", hora: "09:00" }],
  },
  {
    id: 8,
    nombre: "Luis Herrera",
    pais: "Perú",
    programa: "RH 12 10",
    fechaISO: "2025-10-20",
    hora: "17:30",
    etapa: "Promesa",
  },

  // === OTROS ESTADOS ===
  {
    id: 9,
    nombre: "María Pérez",
    pais: "Perú",
    programa: "IT 12 01",
    fechaISO: "2025-09-15",
    hora: "18:00",
    etapa: "Cliente",
  },
  {
    id: 10,
    nombre: "José Ramírez",
    pais: "Chile",
    programa: "RH 10 05",
    fechaISO: "2025-09-20",
    hora: "10:00",
    etapa: "Cliente",
  },
  {
    id: 11,
    nombre: "Pedro Morales",
    pais: "Ecuador",
    programa: "IT 21 04",
    fechaISO: "2025-11-14",
    hora: "13:00",
    etapa: "Cliente",
    recordatorios: [{ fecha: "2025-11-25", hora: "12:00" }],
  },
  {
    id: 12,
    nombre: "Luis Gómez",
    pais: "Chile",
    programa: "RH 25 06",
    fechaISO: "2025-11-02",
    hora: "11:00",
    etapa: "Pendiente",
  },
  {
    id: 13,
    nombre: "Javier Ortiz",
    pais: "Bolivia",
    programa: "IT 30 10",
    fechaISO: "2025-11-06",
    hora: "09:30",
    etapa: "Pendiente",
    recordatorios: [
      { fecha: "2025-11-07", hora: "08:00" },
      { fecha: "2025-11-08", hora: "10:00" },
    ],
  },
  {
    id: 14,
    nombre: "Paola León",
    pais: "Perú",
    programa: "RH 28 06",
    fechaISO: "2025-12-18",
    hora: "10:00",
    etapa: "Pendiente",
  },
  {
    id: 15,
    nombre: "Fernando Arias",
    pais: "Uruguay",
    programa: "IT 20 03",
    fechaISO: "2025-12-09",
    hora: "15:00",
    etapa: "No calificado",
  },
  {
    id: 16,
    nombre: "Sofía Delgado",
    pais: "Paraguay",
    programa: "RH 19 11",
    fechaISO: "2025-11-30",
    hora: "14:30",
    etapa: "No calificado",
    recordatorios: [{ fecha: "2025-12-05", hora: "10:00" }],
  },
  {
    id: 17,
    nombre: "Carlos Rivera",
    pais: "México",
    programa: "IT 13 06",
    fechaISO: "2025-11-11",
    hora: "09:00",
    etapa: "Perdido",
  },
  {
    id: 18,
    nombre: "Natalia Silva",
    pais: "Colombia",
    programa: "RH 23 04",
    fechaISO: "2025-10-28",
    hora: "11:00",
    etapa: "Perdido",
  },
  {
    id: 19,
    nombre: "Esteban Castro",
    pais: "Argentina",
    programa: "RH 14 12",
    fechaISO: "2025-12-12",
    hora: "10:00",
    etapa: "Perdido",
    recordatorios: [
      { fecha: "2025-12-13", hora: "10:00" },
      { fecha: "2025-12-14", hora: "09:00" },
    ],
  },
  {
    id: 20,
    nombre: "Alberto Gutiérrez",
    pais: "México",
    programa: "IT 22 09",
    fechaISO: "2025-10-30",
    hora: "10:30",
    etapa: "Cliente",
  },
  {
    id: 21,
    nombre: "Sandra López",
    pais: "Ecuador",
    programa: "RH 30 09",
    fechaISO: "2025-12-21",
    hora: "13:00",
    etapa: "Cliente",
  },
  {
    id: 22,
    nombre: "Andrea Martínez",
    pais: "Perú",
    programa: "IT 27 11",
    fechaISO: "2025-11-23",
    hora: "08:30",
    etapa: "Registrado",
  },
  {
    id: 23,
    nombre: "Rafael Ibáñez",
    pais: "Perú",
    programa: "RH 19 05",
    fechaISO: "2025-10-17",
    hora: "09:00",
    etapa: "Potencial",
  },
  {
    id: 24,
    nombre: "Carolina Ramos",
    pais: "Chile",
    programa: "IT 30 07",
    fechaISO: "2025-10-19",
    hora: "12:00",
    etapa: "Promesa",
  },
  {
    id: 25,
    nombre: "Julio Espinoza",
    pais: "Perú",
    programa: "RH 20 10",
    fechaISO: "2025-11-25",
    hora: "16:00",
    etapa: "Calificado",
  },
  {
    id: 26,
    nombre: "Miguel Torres",
    pais: "Bolivia",
    programa: "IT 16 04",
    fechaISO: "2025-12-02",
    hora: "10:00",
    etapa: "Pendiente",
  },
  {
    id: 27,
    nombre: "Valeria Rivas",
    pais: "Perú",
    programa: "RH 18 08",
    fechaISO: "2025-12-05",
    hora: "11:30",
    etapa: "Cliente",
  },
];

const etapasProceso = ["Registrado", "Calificado", "Potencial", "Promesa"];
const etapasOtros = ["Pendiente", "Cliente", "No calificado", "Perdido"];

const colorLinea = (etapa: string) => {
  const e = etapa.toLowerCase();
  if (["pendiente", "no calificado", "perdido"].includes(e)) return "#ef4444"; // rojo
  if (["cliente"].includes(e)) return "#22c55e"; // verde
  return "#3b82f6"; // azul
};

export default function VistaLeads() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filtroOtros, setFiltroOtros] = useState<string>("Todos");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLeadsByEtapa = (etapa: string) =>
    leads.filter((l) => l.etapa.toLowerCase() === etapa.toLowerCase());

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  const RenderEtapas = (etapas: string[], filtro?: string) => {
    const etapasFiltradas =
      filtro && filtro !== "Todos" ? [filtro] : etapas;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16,
        }}
      >
        {etapasFiltradas.map((etapa) => {
          const leadsEtapa = getLeadsByEtapa(etapa);
          const color = colorLinea(etapa);

          return (
            <div
              key={etapa}
              style={{
                background: "#f9fafb",
                borderRadius: 10,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                maxHeight: isMobile ? 300 : 420,
              }}
            >
              {/* === Título + contador === */}
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#1e293b",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 14,
                  }}
                >
                  <span>{etapa}</span>
                  <span
                    style={{
                      background: "#e2e8f0",
                      borderRadius: 999,
                      padding: "2px 8px",
                      fontSize: 12,
                      color: "#334155",
                    }}
                  >
                    {leadsEtapa.length}
                  </span>
                </div>
                <div
                  style={{
                    height: 3,
                    background: color,
                    borderRadius: 999,
                    marginTop: 4,
                    width: "100%",
                  }}
                />
              </div>

              {/* === Cards de leads === */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  overflowY: "auto",
                  paddingRight: 4,
                }}
              >
                {leadsEtapa.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: 13,
                      padding: 16,
                    }}
                  >
                    Sin leads asignados
                  </div>
                ) : (
                  leadsEtapa.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() =>
                        navigate(`/leads/oportunidad/${lead.id}`)
                      }
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: 10,
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 4px 10px rgba(0,0,0,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 1px 3px rgba(0,0,0,0.05)")
                      }
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#0f172a",
                          fontSize: 14,
                        }}
                      >
                        {lead.nombre}
                      </div>
                      <div style={{ color: "#475569", fontSize: 13 }}>
                        {lead.pais}
                      </div>
                      <div style={{ color: "#475569", fontSize: 13 }}>
                        {lead.programa}
                      </div>
                      <div
                        style={{
                          color: "#334155",
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <CalendarOutlined /> {formatDate(lead.fechaISO)}{" "}
                        {lead.hora && `(${lead.hora})`}
                      </div>

                      {lead.recordatorios &&
                        lead.recordatorios.length > 0 && (
                          <div
                            style={{
                              marginTop: 8,
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                            }}
                          >
                            {lead.recordatorios.map((rec, idx) => (
                              <div
                                key={idx}
                                style={{
                                  background: "#3b82f6",
                                  color: "#fff",
                                  borderRadius: 6,
                                  padding: "4px 8px",
                                  fontSize: 12,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <FileTextOutlined />
                                Recordatorio: {formatDate(rec.fecha)}{" "}
                                {rec.hora && `(${rec.hora})`}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* === PROCESO DE VENTA === */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          padding: 16,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Proceso de venta</h3>
        {RenderEtapas(etapasProceso)}
      </div>

      {/* === OTROS ESTADOS === */}
      <div
        style={{
          marginTop: 12,
          flex: 1,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          padding: 16,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Otros estados</h3>

        {/* === Filtros === */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {["Todos", ...etapasOtros].map((etapa) => {
            const count =
              etapa === "Todos"
                ? etapasOtros.reduce(
                    (acc, e) => acc + getLeadsByEtapa(e).length,
                    0
                  )
                : getLeadsByEtapa(etapa).length;

            const active = filtroOtros === etapa;

            return (
              <button
                key={etapa}
                onClick={() => setFiltroOtros(etapa)}
                style={{
                  background: active ? "#000" : "#f1f5f9",
                  color: active ? "#fff" : "#000",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {etapa} ({count})
              </button>
            );
          })}
        </div>

        {RenderEtapas(etapasOtros, filtroOtros)}
      </div>
    </div>
  );
}