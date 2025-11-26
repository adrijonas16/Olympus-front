import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Space, Spin, message } from "antd";
import type { OcurrenciaDTO } from "../../../modelos/Ocurrencia";
import { crearHistorialConOcurrencia, getOcurrenciasPermitidas } from "../../../config/rutasApi";

const { Text } = Typography;

type Props = {
  oportunidadId: number;
  usuario?: string;
  onCreado?: () => void;
};

const buttonStyle = (baseColor: string, hoverColor: string, disabled = false): React.CSSProperties => ({
  background: baseColor,
  color: "#0D0C11",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 13,
  fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: "0 1.5px 4px rgba(0, 0, 0, 0.12)",
  transition: "all 0.14s ease",
  userSelect: "none",
  minWidth: 92,
  textAlign: "center" as const,
  display: "inline-block",
});

function useMountedFlag() {
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted;
}

export default function EstadoRegistrado({ oportunidadId, usuario = "SYSTEM", onCreado }: Props) {
  const [ocurrencias, setOcurrencias] = useState<OcurrenciaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingId, setCreatingId] = useState<number | null>(null);
  const mounted = useMountedFlag();

  useEffect(() => {
    if (!oportunidadId && oportunidadId !== 0) return;
    setLoading(true);
    getOcurrenciasPermitidas(oportunidadId)
      .then(list => {
        if (!mounted) return;
        setOcurrencias(Array.isArray(list) ? list : []);
      })
      .catch(err => {
        console.error("getOcurrenciasPermitidas error", err);
        message.error(err?.message ?? "No se pudieron cargar ocurrencias");
      })
      .finally(() => { if (mounted) setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oportunidadId]);

  const handleSelect = async (ocId: number) => {
    if (creatingId) return;
    setCreatingId(ocId);
    try {
      await crearHistorialConOcurrencia(oportunidadId, ocId, usuario);
      message.success("Cambio aplicado");
      if (onCreado) onCreado();
      // refrescar lista
      const list = await getOcurrenciasPermitidas(oportunidadId);
      if (mounted) setOcurrencias(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.error("crearHistorialConOcurrencia error", err);
      message.error(err?.message ?? "Error al aplicar ocurrencia");
    } finally {
      if (mounted) setCreatingId(null);
    }
  };

  const findByName = (name: string) => {
    return ocurrencias.find(o => (o.nombre ?? "").toLowerCase() === name.toLowerCase());
  };

  const renderActionBtn = (label: string, baseColor: string, hoverColor: string) => {
    const oc = findByName(label);
    const allowed = !!oc?.allowed;
    const disabled = !allowed || !!creatingId;
    const id = oc?.id;

    const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled && e.currentTarget) (e.currentTarget as HTMLElement).style.background = hoverColor;
    };
    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.currentTarget) (e.currentTarget as HTMLElement).style.background = disabled ? "#F0F0F0" : baseColor;
    };

    const bg = disabled ? "#F0F0F0" : baseColor;
    const text = label;

    return (
      <div
        key={label}
        role="button"
        aria-disabled={disabled}
        onClick={() => { if (!disabled && id) handleSelect(id); }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          ...buttonStyle(bg, hoverColor, disabled),
          opacity: disabled ? 0.7 : 1,
        }}
        title={!oc ? "Ocurrencia no encontrada" : (disabled ? "No permitido" : "Seleccionar")}
      >
        {text}
      </div>
    );
  };

  if (loading) return <Spin />;

  return (
    <div
      style={{
        background: "#F0F0F0",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* ¿Contestó? */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 14, color: "#0D0C11" }}>¿Contestó?</Text>
        <Space>
          <div
            style={buttonStyle("#E4E4E4", "#D8D8D8")}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#D8D8D8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E4E4E4")}
          >
            Sí
          </div>
          <div
            style={buttonStyle("#E4E4E4", "#D8D8D8")}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#D8D8D8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E4E4E4")}
          >
            No
          </div>
        </Space>
      </Row>

      {/* Ocurrencia header */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 14, color: "#0D0C11" }}>Ocurrencia:</Text>
        <Space>
          <div style={{ width: 12, height: 12, background: "#5D5D5D", borderRadius: 2 }} />
          <Text style={{ fontSize: 11, color: "#5D5D5D" }}>Selecciona una acción</Text>
        </Space>
      </Row>

      <Row gutter={8}>
        {/* Column 1: Registrado / Calificado / Potencial / Promesa */}
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 10,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={10}>
                {renderActionBtn("Registrado", "#C9C9C9", "#BEBEBE")}
                {renderActionBtn("Calificado", "#9CBDFD", "#86ACFB")}
                {renderActionBtn("Potencial", "#9CBDFD", "#86ACFB")}
                {renderActionBtn("Promesa", "#9CBDFD", "#86ACFB")}
              </Space>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 10,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={10}>
                {renderActionBtn("Corporativo", "#FFF6A3", "#FFF08A")}
                {renderActionBtn("Venta Cruzada", "#FFF6A3", "#FFF08A")}
                {renderActionBtn("Seguimiento", "#FFF6A3", "#FFF08A")}
              </Space>
            </div>
          </Space>
        </Col>

        {/* Column 2: Cobranza/Convertido and No Calificado/Perdido */}
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 10,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={10}>
                {renderActionBtn("Cobranza", "#B8F3B8", "#A7E8A7")}
                {renderActionBtn("Convertido", "#B8F3B8", "#A7E8A7")}
              </Space>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 10,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Space wrap style={{ justifyContent: "center" }} size={10}>
                {renderActionBtn("No Calificado", "#F7B1B1", "#F29C9C")}
                {renderActionBtn("Perdido", "#F7B1B1", "#F29C9C")}
              </Space>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
