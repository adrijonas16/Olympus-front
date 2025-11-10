import React from "react";
import { Button, Input, Select, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface Props {
  onClose: () => void;
}

const ModalInversion: React.FC<Props> = ({ onClose }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 12,
        width: "95%",
        maxWidth: 260, // 👈 más pequeño
        position: "relative",
        boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontSize: 13,
        maxHeight: "85%",
        overflowY: "auto",
      }}
    >
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={onClose}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          color: "#555",
          fontSize: 14,
          height: 24,
          width: 24,
        }}
      />

      <Title
        level={5}
        style={{
          textAlign: "center",
          marginBottom: 6,
          marginTop: 0,
          fontSize: 15,
        }}
      >
        Inversión
      </Title>

      <Text>Moneda:</Text>
      <Select
        defaultValue="USD"
        size="small"
        style={{ width: "100%" }}
        options={[{ label: "USD $ Dólar estadounidense", value: "USD" }]}
      />

      <Text>Costo total:</Text>
      <Input size="small" value="$100" readOnly />

      <Text>Descuento:</Text>
      <Select
        defaultValue="25%"
        size="small"
        style={{ width: "100%" }}
        options={[{ label: "25 %", value: "25%" }]}
      />

      <Text>Total:</Text>
      <Input size="small" value="$75" readOnly />

      <div
        style={{
          background: "#f7f7f7",
          padding: 8,
          borderRadius: 6,
          fontSize: 12,
          textAlign: "center",
        }}
      >
        <Text>$100 menos 25% de descuento</Text>
        <br />
        <Text strong>Total $75</Text>
      </div>

      <Button
        type="primary"
        block
        size="small"
        style={{ marginTop: 6 }}
        onClick={onClose}
      >
        Guardar
      </Button>
    </div>
  );
};

export default ModalInversion;
