import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";

type Lead = {
  id: number;
  fechaISO: string;
  hora?: string;
  nombre: string;
  pais: string;
  etapa: string;
  programa: string;
  recordatorio?: string | null;
};

const headerBg = "#0f1724";
const colMinWidth = 200;

export default function VistaTablaComponent() {
  const navigate = useNavigate();

  const [data] = useState<Lead[]>([
    {
      id: 1,
      fechaISO: "2025-12-24T23:00:00Z",
      hora: "23:00",
      nombre: "Edson Mayta Escobedo",
      pais: "Perú",
      etapa: "Calificado",
      programa: "RH 25 06",
      recordatorio: "2025-09-29",
    },
    {
      id: 2,
      fechaISO: "2025-12-24T23:00:00Z",
      hora: "23:00",
      nombre: "María Pérez Sánchez",
      pais: "Perú",
      etapa: "Cliente",
      programa: "RH 25 06",
      recordatorio: null,
    },
    {
      id: 3,
      fechaISO: "2025-12-25T10:30:00Z",
      hora: "10:30",
      nombre: "Luis Gómez",
      pais: "Chile",
      etapa: "Pendiente",
      programa: "IT 12 01",
      recordatorio: "2025-05-25",
    },
  ]);

  type SortDir = "asc" | "desc" | null;
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") setSortDir("desc");
    else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const formattedLongDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formattedShortDate = (iso?: string | null) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const etapaColor = (etapa: string) => {
    const e = etapa.toLowerCase();
    if (["pendiente", "no calificado", "perdido"].includes(e)) return "#ff4d4f";
    if (["cliente"].includes(e)) return "#52c41a";
    if (["registrado", "calificado", "potencial", "promesa"].includes(e))
      return "#1677ff";
    return "#9ca3af";
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      let av: any = (a as any)[sortKey];
      let bv: any = (b as any)[sortKey];
      if (sortKey === "fechaISO" || sortKey === "recordatorio") {
        av = new Date(av || 0).getTime();
        bv = new Date(bv || 0).getTime();
      } else {
        av = String(av || "").toLowerCase();
        bv = String(bv || "").toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const headerCell = (label: string, key: string) => {
    const active = sortKey === key;
    const arrow = active ? (sortDir === "asc" ? " ▲" : " ▼") : "";
    return (
      <div
        role="button"
        onClick={() => toggleSort(key)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontWeight: 600,
          gap: 6,
          userSelect: "none",
          minWidth: colMinWidth,
        }}
      >
        <span style={{ fontSize: 13 }}>{label + arrow}</span>
        <FilterOutlined style={{ color: "#cbd5e1", fontSize: 14 }} />
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <h3 style={{ margin: "6px 8px", color: "#0f1724", fontWeight: 700 }}>
        Oportunidades
      </h3>

      {/* Contenedor con scroll interno */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "#f9fafb",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <div style={{ minWidth: `${colMinWidth * 6}px` }}>
          {/* CABECERA */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(6, minmax(${colMinWidth}px, 1fr))`,
              background: headerBg,
              color: "#fff",
              borderRadius: 10,
              padding: 10,
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              position: "sticky",
              top: 0,
              zIndex: 5,
            }}
          >
            {headerCell("Fecha y Hora", "fechaISO")}
            {headerCell("Nombre Completo", "nombre")}
            {headerCell("País", "pais")}
            {headerCell("Etapa", "etapa")}
            {headerCell("Programa", "programa")}
            {headerCell("Recordatorio", "recordatorio")}
          </div>

          {/* FILAS */}
          {sortedData.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/leads/oportunidad/${item.id}`)}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(6, minmax(${colMinWidth}px, 1fr))`,
                alignItems: "center",
                gap: 8,
                background: "#fff",
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0,0,0,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.05)")
              }
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 13,
                    color: "#111827",
                  }}
                >
                  <span>
                    {formattedLongDate(item.fechaISO)}
                    <CalendarOutlined
                      style={{ color: "#6b7280", marginLeft: 4 }}
                    />
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#374151",
                    fontSize: 13,
                  }}
                >
                  <ClockCircleOutlined style={{ color: "#6b7280" }} />
                  <span>{item.hora ?? "00:00"}</span>
                </div>
              </div>

              <div style={{ color: "#111827", fontSize: 14, textAlign: "center" }}>
                {item.nombre}
              </div>

              <div style={{ color: "#374151", fontSize: 13, textAlign: "center" }}>
                {item.pais}
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    background: etapaColor(item.etapa),
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: 999,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 13,
                    width: "100%",
                  }}
                >
                  {item.etapa}
                </div>
              </div>

              <div style={{ color: "#374151", fontSize: 13, textAlign: "center" }}>
                {item.programa}
              </div>

              <div style={{ color: "#374151", fontSize: 13, textAlign: "center" }}>
                {formattedShortDate(item.recordatorio)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
