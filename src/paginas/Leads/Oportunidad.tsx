import { useParams } from "react-router-dom";
import { Button, Card, Row, Col, Space, Input, Spin, Alert } from "antd";
import {
  EditOutlined,
  CopyOutlined,
  FileOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
  WhatsAppOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import TablaEstadosReducida from "./TablaEstados";
import Cookies from "js-cookie";
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
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      console.warn("⚠️ No se encontró el token en las cookies");
      setLoading(false);
      return;
    }
    if (!id) return;
    setLoading(true);
    setError(null);

    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/VTAModVentaOportunidad/HistorialEstado/PorOportunidad/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setCliente(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al obtener los datos del cliente");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const interacciones = [
    {
      tipo: "nota",
      mensaje: "Mensaje de la nota...",
      fecha: "24/12/2025",
      usuario: "FERNANDO",
    },
    {
      tipo: "wsp",
      telefono: "+51 912345678",
      mensaje: "Mensaje enviado por WhatsApp...",
      fecha: "24/12/2025",
      usuario: "FERNANDO",
    },
    {
      tipo: "recordatorio",
      fechaRecordatorio: "Viernes 25 de septiembre - 15:30",
      mensaje: "Recordatorio importante...",
      fecha: "24/12/2025",
      usuario: "FERNANDO",
    },
  ];

  const oportunidadActual = {
    codigo: "RH2506",
    fechaCreacion: "2025-12-24",
    estado: "Calificado",
    llamadasContestadas: 2,
    llamadasNoContestadas: 1,
    asesor: "Edson Mayta",
  };

  

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
