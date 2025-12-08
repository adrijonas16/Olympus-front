import { Row, Col } from "antd";
import { useParams } from "react-router-dom";
import ClienteProductoCard from "./ClienteProducto";
import OportunidadPanel from "./OportunidadPanel";
import HistorialInteraccion from "./HistorialInteraccion";
import ModalLead from "./ModalLead";

function VistaProceso({ oportunidadId }: { oportunidadId: string | undefined }) {
  return (
    <div style={{ padding: 16, height: "100%" }}>
      <Row gutter={16} style={{ height: "100%" }}>
        {/* Columna izquierda: Cliente con su borde */}
        <Col
          xs={24}
          md={6}
          lg={6}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              padding: 12,
              height: "100%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <ClienteProductoCard />
          </div>
        </Col>

        {/* Columna central y derecha con borde compartido */}
        <Col
          xs={24}
          md={18}
          lg={18}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
          }}
        >
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              flexDirection: "row",
              gap: 16,
              width: "100%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <div
              style={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                maxWidth: "65%",
              }}
            >
              <OportunidadPanel oportunidadId={oportunidadId} />
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <HistorialInteraccion />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default function Leads() {
  const { id } = useParams<{ id: string }>();

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
      <div style={{ flex: 1, minHeight: 0 }}>
        <VistaProceso oportunidadId={id} />
      </div>

      <ModalLead open={false} onClose={() => {}} />
    </div>
  );
}
