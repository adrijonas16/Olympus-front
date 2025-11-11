import React, { useState } from "react";
import { Button, Checkbox, Divider, Select, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface Props {
  onClose: () => void;
}

const ModalHorarios: React.FC<Props> = ({ onClose }) => {
  const [dias, setDias] = useState(["L", "M", "X", "J", "V"]);
  const [pais, setPais] = useState("Perú");

  const toggleDia = (d: string) => {
    setDias((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 12,
        width: "95%",           // 👈 se adapta al ancho disponible
        maxWidth: 260,          // 👈 modal más pequeño
        position: "relative",
        boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
        maxHeight: "85%",
        overflowY: "auto",
        fontSize: 13,
      }}
    >
      {/* Botón cerrar */}
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

      {/* Título */}
      <Title
        level={5}
        style={{
          textAlign: "center",
          marginBottom: 8,
          marginTop: 0,
          fontSize: 15,
        }}
      >
        Horarios
      </Title>

      <Text>
        Inicio: <strong>21-09-2025</strong>
      </Text>
      <br />
      <Text>
        Fin: <strong>21-11-2025</strong>
      </Text>
      <Divider style={{ margin: "6px 0" }} />

      <Text>Días:</Text>
      <div
        style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        {["D", "L", "M", "X", "J", "V", "S"].map((d) => (
          <Button
            key={d}
            type={dias.includes(d) ? "primary" : "default"}
            size="small"
            onClick={() => toggleDia(d)}
            style={{
              width: 28,
              height: 28,
              background: dias.includes(d) ? "#1677ff" : "#f0f0f0",
              color: dias.includes(d) ? "#fff" : "#000",
              border: "none",
              borderRadius: 6,
              padding: 0,
              fontSize: 12,
            }}
          >
            {d}
          </Button>
        ))}
      </div>

      <div style={{ marginTop: 6 }}>
        <Text>
          Inicio: <strong>7:00 am</strong>
        </Text>
        <br />
        <Text>
          Fin: <strong>9:00 am</strong>
        </Text>
      </div>

      <Checkbox checked style={{ marginTop: 6, fontSize: 12 }}>
        Repetir en días seleccionados
      </Checkbox>

      <Select
        value={pais}
        style={{ width: "100%", marginTop: 6 }}
        size="small"
        options={[{ value: "Perú", label: "Perú" }]}
      />

      <div
        style={{
          background: "#f7f7f7",
          padding: 6,
          borderRadius: 6,
          marginTop: 8,
          fontSize: 12,
          textAlign: "center",
        }}
      >
        <Text>
          L-V <br /> 7:00 am → 9:00 am <strong>PE</strong>
        </Text>
      </div>

      <Button
        type="primary"
        block
        size="small"
        style={{ marginTop: 10 }}
        onClick={onClose}
      >
        Guardar
      </Button>
    </div>
  );
};

export default ModalHorarios;
