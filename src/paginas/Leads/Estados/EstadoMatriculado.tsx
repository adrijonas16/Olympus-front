import React, { useState } from "react";
import { Typography, Tag, Row, Col, Input, Button, Space, Table } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const EstadoMatriculado: React.FC = () => {
  const [tabActivo, setTabActivo] = useState<"cobranza" | "convertido">("cobranza");

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
    { n: 1, fecha: "31-10-2025", monto: "$ 100", pendiente: "$ 75", abonado: "$ 75" },
    { n: 2, fecha: "30-11-2025", monto: "$ 100", pendiente: "$ 75", abonado: "$ 75" },
    { n: 3, fecha: "31-12-2025", monto: "$ 100", pendiente: "$ 75", abonado: "$ 75" },
  ];

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
      {/* === Ocurrencia === */}
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
          Recuerda que para pasar a la ocurrencia de tipo Convertido el cliente debe
          de completar sus pagos
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
          <Text strong style={{ fontSize: 14, color: "#0D0C11" }}>
            Cobranza
          </Text>

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
            style={{
              background: "#005FF8",
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
          <Text strong style={{ fontSize: 14, color: "#0D0C11" }}>
            Convertido
          </Text>

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
            style={{
              background: "#005FF8",
              borderRadius: 6,
              marginTop: 12,
            }}
          >
            Confirmar pago
          </Button>
        </div>
      )}
    </div>
  );
};

export default EstadoMatriculado;
