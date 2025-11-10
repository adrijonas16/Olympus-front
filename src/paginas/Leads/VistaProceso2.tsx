import { Card, Row, Col } from "antd";
import ClienteProductoCard from "./ClienteProducto";
import OportunidadPanel from "./OportunidadPanel"; // 👉 nuevo componente

export default function VistaProceso() {
  return (
    <div style={{ padding: 16, height: "100%" }}>
      <Row gutter={16} style={{ height: "100%" }}>
        {/* Columna izquierda */}
        <Col
          xs={24}
          md={10}
          lg={8}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <ClienteProductoCard />
        </Col>

        {/* Columna derecha */}
        <Col
          xs={24}
          md={14}
          lg={16}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <OportunidadPanel />
        </Col>
      </Row>
    </div>
  );
}
