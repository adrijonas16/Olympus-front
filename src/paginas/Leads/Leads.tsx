import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spin, message, Alert } from "antd";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ClienteProductoCard from "./ClienteProducto";
import OportunidadPanel from "./OportunidadPanel";
import HistorialInteraccion from "./HistorialInteraccion";
import ModalLead from "./ModalLead";
import { getCookie } from "../../utils/cookies";

interface TokenData {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

function VistaProceso({ oportunidadId }: { oportunidadId: string | undefined }) {
  return (
    <div style={{ padding: 16, height: "100%" }}>
      <Row gutter={16} style={{ height: "100%" }}>
        <Col xs={24} md={6} lg={6} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

        <Col xs={24} md={18} lg={18} style={{ display: "flex", flexDirection: "row", gap: 16 }}>
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
            <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 16 }}>
              <OportunidadPanel oportunidadId={oportunidadId} />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
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
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [permitido, setPermitido] = useState(false);
  const [errorControlado, setErrorControlado] = useState<string | null>(null); // ← Nuevo estado

  useEffect(() => {
    const validarPermiso = async () => {
      try {
        const token = getCookie("token");

        if (!token) {
          message.error("Sesión no válida");
          navigate("/login");
          return;
        }

        let idUsuario = 0;
        let rolNombre = "";

        try {
          const decoded = jwtDecode<TokenData>(token);
          idUsuario = parseInt(
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "0"
          );
          rolNombre = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
        } catch (e) {
          console.error("Error al decodificar token", e);
          message.error("Error en la sesión");
          navigate("/login");
          return;
        }

        const rolesMap: Record<string, number> = {
          Asesor: 1,
          Supervisor: 2,
          Gerente: 3,
          Administrador: 4,
          Desarrollador: 5,
        };
        const idRol = rolesMap[rolNombre] ?? 0;

        const response = await fetch(
          `/api/VTAModVentaHistorialEstado/OcurrenciasPermitidas/${id}/${idUsuario}/${idRol}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Error al validar acceso");

        const data = await response.json();

        // Validar código de error controlado
        if (data.codigo === "ERROR_CONTROLADO") {
          setErrorControlado(data.mensaje || "No tienes permiso para ver esta oportunidad.");
          return; // No permitir renderizar VistaProceso
        }

        setPermitido(true);
      } catch (error) {
        console.error(error);
        message.error("Error al validar acceso");
        navigate("/leads/Opportunities");
      } finally {
        setLoading(false);
      }
    };

    validarPermiso();
  }, [id, navigate]);

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );

  // Mostrar mensaje de error controlado en toda la pantalla
  if (errorControlado)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Alert type="error" message={errorControlado} />
      </div>
    );

  if (!permitido) return null;

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
