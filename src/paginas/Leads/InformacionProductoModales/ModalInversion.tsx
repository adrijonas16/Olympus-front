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
        padding: 16,
        width: "95%",
        maxWidth: 520,    
        position: "relative",
        boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
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
          top: 6,
          right: 6,
          color: "#666",
          fontSize: 16,
        }}
      />

      <Title
        level={5}
        style={{
          textAlign: "center",
          marginBottom: 8,
          marginTop: 0,
        }}
      >
        Inversión
      </Title>

      <Text>Moneda:</Text>
      <Select
        defaultValue="USD"
        size="middle"
        style={{ width: "100%" }}
        options={[
          { label: "USD $ Dólar estadounidense", value: "USD" },
        ]}
      />

      <Text>Costo total:</Text>
      <Input size="middle" value="$100" readOnly />

      <Text>Descuento:</Text>
      <Select
        defaultValue="25%"
        size="middle"
        style={{ width: "100%" }}
        options={[{ label: "25 %", value: "25%" }]}
      />

      <Text>Total:</Text>
      <Input size="middle" value="$75" readOnly />

      <div
        style={{
          background: "#f7f7f7",
          padding: 10,
          borderRadius: 6,
          textAlign: "center",
        }}
      >
        <Text>$100 menos 25% de descuento</Text>
        <br />
        <Text strong>Total $75</Text>
      </div>

      <Button type="primary" block size="middle" onClick={onClose}>
        Guardar
      </Button>
    </div>
  );
};

export default ModalInversion;
