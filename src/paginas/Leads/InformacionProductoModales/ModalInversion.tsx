import React from "react";
import { Button, Input, Select, Typography, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
}

const ModalInversion: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      closeIcon={<CloseOutlined />}
      styles={{
        body: {
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 13,
        }
      }}
    >
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

      <Text>Costo total:</Text>
      <Input size="middle" value="$100" readOnly />

      <Text>Descuento:</Text>
      <Select
        defaultValue="5%"
        size="middle"
        style={{ width: "100%" }}
        options={[
          { label: "5 %", value: "5%" },
          { label: "10 %", value: "10%" },
          { label: "15 %", value: "15%" },
          { label: "20 %", value: "20%" },
          { label: "25 %", value: "25%" },
          { label: "30 %", value: "30%" },
        ]}
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
    </Modal>
  );
};

export default ModalInversion;
