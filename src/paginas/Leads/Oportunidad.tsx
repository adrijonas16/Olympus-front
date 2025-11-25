import { useParams } from "react-router-dom";
import { Button, Card, Row, Col, Space } from "antd";
import {
  EditOutlined,
  CopyOutlined,
  FileOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
  WhatsAppOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import TablaEstadosReducida from "./TablaEstados";
import ModalEditarCliente from "./CompCliente";
import OportunidadActual from "./OportunidadActual";
import ControlOportunidades from "./Control";

const colMinWidth = 200;

// 📍 Mapa de países
const paises: Record<number, string> = {
  1: "Angola",
  2: "Argentina",
  3: "Aruba",
  4: "Belice",
  5: "Bolivia",
  6: "Brasil",
  7: "Canada",
  8: "Chile",
  9: "Colombia",
  10: "Costa Rica",
  11: "Cuba",
  12: "Ecuador",
  13: "El Salvador",
  14: "España",
  15: "Estados Unidos",
  16: "Guatemala",
  17: "Guyana",
  18: "Haití",
  19: "Honduras",
  20: "Italia",
  21: "Kuwait",
  22: "México",
  23: "Nicaragua",
  24: "Panamá",
  25: "Paraguay",
  26: "Perú",
  27: "Puerto Rico",
  28: "República Dominicana",
  29: "Trinidad y Tobago",
  30: "United States",
  31: "Uruguay",
  32: "Venezuela",
};

interface Cliente {
  id: number;
  idPais: number;
  nombres: string;
  apellidos: string;
  celular: string;
  prefijoPaisCelular: string;
  correo: string;
  areaTrabajo: string;
  industria: string;
  desuscrito: boolean;
  estado: boolean;
}

export default function Oportunidad() {
  const { id } = useParams<{ id: string }>();
  const [celularCliente, setCelularCliente] = useState<string>("");



  return (
    <Row gutter={[16, 16]} style={{ padding: 16 }}>
      {/* === Columna izquierda === */}
      <Col xs={24} md={6}>
        <ModalEditarCliente
          id={id}
          onUpdated={() => window.location.reload()}
          onCelularObtenido={(celularConPrefijo) => setCelularCliente(celularConPrefijo)}
        />
      </Col>

      {/* === Columna derecha === */}
      <Col
        xs={24}
        md={18}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {/* Card de botones */}
        <Card
          style={{
            backgroundColor: "#f1f5f998",
            margin: "0 auto",
            borderRadius: 12,
          }}
          bodyStyle={{ padding: 16 }}
        >
          <Space
            size={16}
            style={{
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Button
              type="primary"
              style={{ backgroundColor: "#000", borderColor: "#000" }}
            >
              Oportunidad actual
            </Button>
            <Button
              style={{
                backgroundColor: "#fff",
                borderColor: "#000",
                color: "#000",
              }}
            >
              Historial oportunidades{" "}
              <span style={{ color: "#3b82f6" }}>(5)</span>
            </Button>
          </Space>
        </Card>

        {/* Card de Oportunidad Actual */}
        <Card style={{ flex: 1 }}>
          <OportunidadActual id={id} />
          <ControlOportunidades idOportunidad={id} />
          {/* Historial dividido en 2 columnas */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 16,
            }}
          >
            <Row gutter={[16, 16]}>
              {/* Columna izquierda - Historial de Estados */}
            
                  <TablaEstadosReducida idOportunidad={id}/>

            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
