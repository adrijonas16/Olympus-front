import React, { useState } from "react";
import { Space, Card, Button } from "antd";

const estados = [
  { nombre: "Todos", fondo: "#FFFFFF", borde: "0.5px solid black" },
  { nombre: "Desuscrito", fondo: "#FFCDCD" },
  { nombre: "Nota", fondo: "#FFF7B3" },
  { nombre: "WhatsApp", fondo: "#DBFFD2" },
  { nombre: "Recordatorio", fondo: "#DCDCDC", borde: "1px solid #005FF8" },
];

interface FiltroEstadosProps {
  onAceptar?: (seleccionados: string[]) => void;
  onCancelar?: () => void;
}

const FiltroEstados: React.FC<FiltroEstadosProps> = ({ onAceptar, onCancelar }) => {
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const toggleSeleccion = (nombre: string) => {
    setSeleccionados((prev) =>
      prev.includes(nombre)
        ? prev.filter((e) => e !== nombre)
        : [...prev, nombre]
    );
  };

  const handleAceptar = () => {
    if (onAceptar) onAceptar(seleccionados);
    if (onCancelar) onCancelar(); // para cerrar la vista si aplica
  };

  return (
    <Card
      style={{
        width: "100%",
        background: "#FFFFFF",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.35)",
        borderRadius: 8,
        padding: 12,
      }}
      bodyStyle={{ padding: 8 }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={6}>
        {estados.map((e, i) => {
          const isSelected = seleccionados.includes(e.nombre);
          return (
            <div
              key={i}
              onClick={() => toggleSeleccion(e.nombre)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                background: e.fondo,
                borderRadius: 8,
                border: isSelected
                  ? "2px solid #1677FF"
                  : e.borde || "1px solid transparent",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  border: "1px solid #110C11",
                  background: isSelected ? "#1677FF" : "transparent",
                }}
              />
              <div
                style={{
                  color: "#0D0C11",
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "20px",
                }}
              >
                {e.nombre}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <Button
            type="primary"
            size="small"
            onClick={handleAceptar}
            style={{ borderRadius: 6, fontSize: 12, padding: "0 12px" }}
          >
            Aceptar
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default FiltroEstados;
