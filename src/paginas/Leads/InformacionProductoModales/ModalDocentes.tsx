import React, { useState } from "react";
import { Button, Checkbox, Table, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface Props {
  onClose: () => void;
}

const ModalDocentes: React.FC<Props> = ({ onClose }) => {
  const [data, setData] = useState([
    { key: 1, nombre: "Jose Rafael Corzo Luis", logros: "Ejemplo de logros", mostrar: true },
    { key: 2, nombre: "Fernando Ibarra", logros: "Ejemplo de logros", mostrar: true },
    { key: 3, nombre: "Fernando Ibarra 2", logros: "Ejemplo de logros", mostrar: false },
    { key: 4, nombre: "Fernando Ibarra", logros: "Ejemplo de logros", mostrar: false },
  ]);

  const toggleMostrar = (key: number) =>
    setData((prev) =>
      prev.map((d) => (d.key === key ? { ...d, mostrar: !d.mostrar } : d))
    );

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: "55%",
      ellipsis: true,
    },
    {
      title: "Logros",
      dataIndex: "logros",
      key: "logros",
      width: "30%",
      ellipsis: true,
    },
    {
      title: "Mostrar",
      dataIndex: "mostrar",
      width: "15%",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Checkbox
          checked={record.mostrar}
          onChange={() => toggleMostrar(record.key)}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 12,
        width: "95%",
        maxWidth: 280, // 👈 más pequeño
        position: "relative",
        boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
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
          marginBottom: 8,
          marginTop: 0,
          fontSize: 15,
        }}
      >
        Docentes del producto
      </Title>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        bordered
        style={{ fontSize: 12 }}
      />

      <Button type="primary" block size="small" style={{ marginTop: 10 }} onClick={onClose}>
        Guardar
      </Button>
    </div>
  );
};

export default ModalDocentes;
