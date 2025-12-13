import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spin, message, Alert } from "antd";
import ClienteProductoCard from "./ClienteProducto";
import OportunidadPanel from "./OportunidadPanel";
import HistorialInteraccion from "./HistorialInteraccion";
import ModalLead from "./ModalLead";
import { getCookie } from "../../utils/cookies";
import api from "../../servicios/api";
import { jwtDecode } from "jwt-decode";

interface TokenData {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

function VistaProceso({
  oportunidadId,
}: {
  oportunidadId: string | undefined;
}) {
  return (
    <div style={{ padding: 16, height: "100%" }}>
      <Row gutter={16} style={{ height: "100%" }}>
        <Col
          xs={24}
          md={6}
          lg={6}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
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

        <Col
          xs={24}
          md={18}
          lg={18}
          style={{ display: "flex", flexDirection: "row", gap: 16 }}
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
                minWidth: 0,
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
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [permitido, setPermitido] = useState(false);
  const [errorControlado, setErrorControlado] = useState<string | null>(null);

  const token = getCookie("token");

  const { idUsuario, idRol } = useMemo(() => {
    let idU = 0;
    let rNombre = "";
    let idR = 0;

    if (!token) return { idUsuario: 0, rolNombre: "", idRol: 0 };

    try {
      const decoded = jwtDecode<TokenData>(token);
      idU = parseInt(
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "0"
      );
      rNombre = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";

      const rolesMap: Record<string, number> = {
        Asesor: 1,
        Supervisor: 2,
        Gerente: 3,
        Administrador: 4,
        Desarrollador: 5,
      };
      idR = rolesMap[rNombre] ?? 0;
    } catch (e) {
      console.error("Error al decodificar token (useMemo)", e);
    }

    return { idUsuario: idU, rolNombre: rNombre, idRol: idR };
  }, [token]);

  useEffect(() => {
    const validarPermiso = async () => {
      try {
        if (!token) {
          message.error("Sesión no válida");
          navigate("/login");
          return;
        }

        if (!idUsuario || !idRol) {
          message.error("Sesión inválida o falta información de usuario");
          navigate("/login");
          return;
        }

        setLoading(true);
        setErrorControlado(null);

        // 1) Validar permisos de oportunidad
        const permisosRes = await api.get(
          `/api/SegModLogin/ObtenerPermisosDeOportunidad/${id}/${idUsuario}/${idRol}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const permisosData = permisosRes.data;

        if (permisosData?.codigo === "ERROR_CONTROLADO") {
          setErrorControlado(permisosData.mensaje);
          return;
        }

        // 2) Obtener ocurrencias permitidas (si la lógica lo requiere)
        const ocurrenciasRes = await api.get(
          `/api/VTAModVentaHistorialEstado/OcurrenciasPermitidas/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const ocurrenciasData = ocurrenciasRes.data;
        if (ocurrenciasData?.codigo === "ERROR_CONTROLADO") {
          setErrorControlado(ocurrenciasData.mensaje);
          return;
        }

        // Si todo está bien, permitir acceso
        setPermitido(true);
      } catch (e: any) {
        console.error("Error validando permisos:", e);
        const apiMessage = e?.response?.data?.message ?? e?.message;
        message.error(apiMessage || "Error al validar acceso");
        navigate("/leads/Opportunities");
      } finally {
        setLoading(false);
      }
    };

    validarPermiso();
  }, [id, navigate, idUsuario, idRol, token]);

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );

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
