import React, { useEffect, useState } from "react";
import { Typography, Tag, Row, Col, Input, Button, Space, Table, Spin, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import type { OcurrenciaDTO } from "../../../modelos/Ocurrencia";
import { crearHistorialConOcurrencia, getOcurrenciasPermitidas } from "../../../config/rutasApi";

const { Text } = Typography;

type Props = {
  oportunidadId: number;
  usuario?: string;
  onCreado?: () => void;
};

const EstadoMatriculado: React.FC<Props> = ({ oportunidadId, usuario = "SYSTEM", onCreado }) => {
  const [tabActivo, setTabActivo] = useState<"cobranza" | "convertido">("cobranza");
  const [ocurrencias, setOcurrencias] = useState<OcurrenciaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [creating, setCreating] = useState<number | null>(null);

  const columnsCobranza = [
    { title: "N° cuotas", dataIndex: "n", key: "n" },
    { title: "Fecha vencimiento", dataIndex: "fecha", key: "fecha" },
    { title: "Monto a abonar", dataIndex: "monto", key: "monto" },
    { title: "Monto pendiente", dataIndex: "pendiente", key: "pendiente" },
    { title: "Monto abonado", dataIndex: "abonado", key: "abonado" },
    { title: "Método", dataIndex: "metodo", key: "metodo" },
    { title: "Fecha de pago", dataIndex: "pago", key: "pago" },
  ];

  const dataCobranza = [
    { key: 1, n: 1, fecha: "31-10-2025", monto: "$ 100", pendiente: "$ 75", abonado: "$ 25", metodo: "Tarjeta", pago: "—" },
    { key: 2, n: 2, fecha: "30-11-2025", monto: "$ 100", pendiente: "$ 75", abonado: "$ 25", metodo: "Transferencia", pago: "—" },
    { key: 3, n: 3, fecha: "31-12-2025", monto: "$ 100", pendiente: "$ 75", abonado: "$ 25", metodo: "Efectivo", pago: "—" },
  ];

  useEffect(() => {
    let mounted = true;
    if (!oportunidadId && oportunidadId !== 0) return;

    setLoading(true);
    getOcurrenciasPermitidas(oportunidadId)
      .then(list => {
        if (!mounted) return;
        setOcurrencias(Array.isArray(list) ? list : []);
      })
      .catch(err => {
        console.error("getOcurrenciasPermitidas error", err);
        message.error(err?.message ?? "No se pudieron cargar las ocurrencias");
        setOcurrencias([]);
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [oportunidadId]);

  const findOcurrenciaByName = (name: string) =>
    ocurrencias.find(o => (o.nombre ?? "").toLowerCase() === name.toLowerCase());

  const handleCrearOcurrencia = async (ocId: number) => {
    if (creating) return;
    setCreating(ocId);
    try {
      await crearHistorialConOcurrencia(oportunidadId, ocId, usuario);
      message.success("Cambio aplicado");
      const list = await getOcurrenciasPermitidas(oportunidadId);
      setOcurrencias(Array.isArray(list) ? list : []);
      if (onCreado) onCreado();
    } catch (err: any) {
      console.error("crearHistorialConOcurrencia error", err);
      message.error(err?.message ?? "Error al crear historial");
    } finally {
      setCreating(null);
    }
  };

  const handleConfirmarPagoCuota = () => {
    const oc = findOcurrenciaByName("Cobranza");
    if (!oc) return message.error("Ocurrencia Cobranza no encontrada");
    if (!oc.allowed) return message.warning("No permitido cambiar a Cobranza");
    handleCrearOcurrencia(oc.id);
  };

  const handlePasarAConvertido = () => {
    const oc = findOcurrenciaByName("Convertido");
    if (!oc) return message.error("Ocurrencia Convertido no encontrada");
    if (!oc.allowed) return message.warning("No permitido cambiar a Convertido");
    handleCrearOcurrencia(oc.id);
  };

  if (loading) return <Spin />;

  const ocCobranza = findOcurrenciaByName("Cobranza");
  const ocConvertido = findOcurrenciaByName("Convertido");
  const allowCobranza = !!ocCobranza?.allowed && creating !== ocCobranza?.id;
  const allowConvertido = !!ocConvertido?.allowed && creating !== ocConvertido?.id;

  return (
    <div
      style={{
        background: "#F0F0F0",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* === Ocurrencia / Tabs === */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 14, color: "#0D0C11" }}>Ocurrencia:</Text>
        <Space>
          <Tag
            color={tabActivo === "cobranza" ? "#B8F3B8" : "#D1D1D1"}
            style={{
              cursor: "pointer",
              color: "#0D0C11",
              fontWeight: 500,
              borderRadius: 6,
            }}
            onClick={() => setTabActivo("cobranza")}
          >
            Cobranza
          </Tag>

          <Tag
            color={tabActivo === "convertido" ? "#B8F3B8" : "#D1D1D1"}
            style={{
              cursor: "pointer",
              color: "#0D0C11",
              fontWeight: 500,
              borderRadius: 6,
            }}
            onClick={() => setTabActivo("convertido")}
          >
            Convertido
          </Tag>
        </Space>
      </Row>

      {/* === Nota informativa === */}
      <div
        style={{
          background: "#ECECEC",
          borderRadius: 10,
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <InfoCircleOutlined style={{ color: "#5D5D5D" }} />
        <Text style={{ fontSize: 12, color: "#5D5D5D" }}>
          Recuerda que para pasar a la ocurrencia de tipo Convertido el cliente debe completar condiciones de pago (según reglas de negocio).
        </Text>
      </div>

      {/* === Contenido dinámico === */}
      {tabActivo === "cobranza" ? (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          }}
        >
          <Text strong style={{ fontSize: 14, color: "#0D0C11" }}>Cobranza</Text>

          <Input
            placeholder="Selecciona número de cuotas..."
            disabled
            style={{
              margin: "10px 0",
              borderRadius: 8,
              background: "#F8F8F8",
            }}
          />

          <Table
            columns={columnsCobranza}
            dataSource={dataCobranza}
            pagination={false}
            size="small"
            style={{ marginBottom: 10 }}
          />

          <Button
            type="primary"
            block
            onClick={handleConfirmarPagoCuota}
            disabled={!allowCobranza}
            loading={creating === ocCobranza?.id}
            style={{
              background: allowCobranza ? "#005FF8" : "#E6E6E6",
              borderRadius: 6,
              marginTop: 8,
            }}
          >
            Confirmar pago de cuota
          </Button>
        </div>
      ) : (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          }}
        >
          <Text strong style={{ fontSize: 14, color: "#0D0C11" }}>Convertido</Text>

          <Row gutter={8} style={{ marginTop: 10 }}>
            <Col span={6}>
              <Input prefix="$" value="100" disabled />
            </Col>
            <Col span={6}>
              <Input prefix="$" value="0" disabled />
            </Col>
            <Col span={6}>
              <Input prefix="$" value="100" disabled />
            </Col>
            <Col span={6}>
              <Input placeholder="26-09-2025" disabled />
            </Col>
          </Row>

          <Button
            type="primary"
            block
            onClick={handlePasarAConvertido}
            disabled={!allowConvertido}
            loading={creating === ocConvertido?.id}
            style={{
              background: allowConvertido ? "#005FF8" : "#E6E6E6",
              borderRadius: 6,
              marginTop: 12,
            }}
          >
            Confirmar pago / Marcar como convertido
          </Button>
        </div>
      )}
    </div>
  );
};

export default EstadoMatriculado;
