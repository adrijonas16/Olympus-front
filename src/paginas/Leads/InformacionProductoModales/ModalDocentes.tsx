import React, { useState, useEffect } from "react";
import { Button, Checkbox, Table, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface DocenteData {
  id: number;
  idDocente: number;
  idPersonaDocente: number;
  docenteNombre: string;
}

interface Props {
  onClose: () => void;
  docentes: DocenteData[];
}

const ModalDocentes: React.FC<Props> = ({ onClose, docentes }) => {
  const [data, setData] = useState<Array<{ key: number; nombre: string; logros: string; mostrar: boolean }>>([]);

  // Cargar datos de docentes desde props
  useEffect(() => {
    const docentesFormateados = docentes.map((docente, index) => ({
      key: docente.idDocente,
      nombre: docente.docenteNombre,
      logros: "Ejemplo de logros", // Este campo puede venir del backend en el futuro
      mostrar: true,
    }));
    setData(docentesFormateados);
  }, [docentes]);

  const toggleMostrar = (key: number) =>
    setData((prev) =>
      prev.map((d) => (d.key === key ? { ...d, mostrar: !d.mostrar } : d))
    );

  const columns = [
    { title: "Nombre", dataIndex: "nombre", width: "45%", ellipsis: true },
    { title: "Logros", dataIndex: "logros", width: "40%", ellipsis: true },
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
        padding: 16,
        width: "95%",
        maxWidth: 520,  
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
          marginBottom: 12,
          marginTop: 0,
        }}
      >
        Docentes del producto
      </Title>

      {/* ⭐ TABLA OCUPA TODO EL ANCHO AHORA */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        bordered
        style={{ width: "100%" }}
      />

      <Button
        type="primary"
        block
        size="middle"
        style={{ marginTop: 12 }}
        onClick={onClose}
      >
        Guardar
      </Button>
    </div>
  );
};

export default ModalDocentes;
