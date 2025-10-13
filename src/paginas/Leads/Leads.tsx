import { useState } from "react";
import { Button, Card, Divider } from "antd";
import VistaTablaComponent from "./VistaTabla";
import VistaLeads from "./VistaProceso";
import ModalLead from "./ModalLead";


function VistaProceso() {
  return (
    <div>
      <VistaLeads/>
    </div>
  );
}

function VistaTabla() {
  return (
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
      <VistaTablaComponent/>
    </div>
  );
}

export default function Leads() {
  const [vistaSeleccionada, setVistaSeleccionada] = useState<"proceso" | "tabla">("proceso");
  const [openModal, setOpenModal] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        boxSizing: "border-box",
        gap: 12,
      }}
    >
      {/* === Card de botones === */}
      <div style={{ display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
        <Card
          style={{
            background: "#f1f5f9",
            borderRadius: 12,
            padding: 4,
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            maxWidth: "100%",
          }}
          bodyStyle={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 4,
            flexWrap: "wrap",
          }}
        >
          <Button
            type="default"
            style={{
              background: "#fff",
              border: "1px solid #d9d9d9",
              fontWeight: 600,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onClick={() => setOpenModal(true)}
          >
            Agregar oportunidad
          </Button>

          <Divider type="vertical" style={{ height: 28, background: "#cbd5e1" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button
              type="default"
              style={{
                background: vistaSeleccionada === "proceso" ? "#000" : "#fff",
                color: vistaSeleccionada === "proceso" ? "#fff" : "#000",
                fontWeight: 600,
                border: "1px solid #d9d9d9",
                transition: "all 0.2s ease",
              }}
              onClick={() => setVistaSeleccionada("proceso")}
            >
              Vista de proceso
            </Button>

            <Button
              type="default"
              style={{
                background: vistaSeleccionada === "tabla" ? "#000" : "#fff",
                color: vistaSeleccionada === "tabla" ? "#fff" : "#000",
                fontWeight: 600,
                border: "1px solid #d9d9d9",
                transition: "all 0.2s ease",
              }}
              onClick={() => setVistaSeleccionada("tabla")}
            >
              Vista de tabla
            </Button>
          </div>
        </Card>
      </div>

      {/* === Contenido dinámico === */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {vistaSeleccionada === "proceso" ? (
          <VistaProceso />
        ) : (
          <VistaTabla />
        )}
      </div>
      <ModalLead open={openModal}
        onClose={() => setOpenModal(false)} />
    </div>
    
  );
}
