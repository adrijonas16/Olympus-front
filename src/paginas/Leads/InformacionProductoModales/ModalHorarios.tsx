import React, { useState, useMemo, useEffect } from "react";
import { Button, Checkbox, Divider, Select, Typography, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface Horario {
  id: number;
  idProducto: number;
  productoNombre: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  detalle: string;
  orden: number;
  estado: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  fechaInicio?: string;
  fechaFin?: string;
  horarios?: Horario[];
}

const ModalHorarios: React.FC<Props> = ({ open, onClose, fechaInicio, fechaFin, horarios = [] }) => {
  const [pais, setPais] = useState("Perú");

  // Mapeo de letras a nombres completos de días
  const diasMap: Record<string, string> = {
    "D": "Domingo",
    "L": "Lunes",
    "M": "Martes",
    "X": "Miércoles",
    "J": "Jueves",
    "V": "Viernes",
    "S": "Sábado"
  };

  // Extraer días únicos de los horarios
  const diasConHorario = useMemo(() => {
    const diasLetras: string[] = [];
    horarios.forEach(horario => {
      const letra = Object.keys(diasMap).find(key => diasMap[key] === horario.dia);
      if (letra && !diasLetras.includes(letra)) {
        diasLetras.push(letra);
      }
    });
    return diasLetras;
  }, [horarios]);

  const [dias, setDias] = useState<string[]>(diasConHorario);

  // Actualizar días seleccionados cuando cambien los horarios
  useEffect(() => {
    setDias(diasConHorario);
  }, [diasConHorario]);

  // Función para formatear fechas de ISO a DD-MM-YYYY
  const formatearFecha = (fechaISO: string | undefined): string => {
    if (!fechaISO || fechaISO === "0001-01-01T00:00:00") return "-";
    try {
      const fecha = new Date(fechaISO);
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();
      return `${dia}-${mes}-${año}`;
    } catch {
      return "-";
    }
  };

  // Función para formatear hora de HH:mm:ss a HH:mm am/pm
  const formatearHora = (horaStr: string): string => {
    if (!horaStr) return "-";
    try {
      const [horas, minutos] = horaStr.split(":");
      const hora = parseInt(horas, 10);
      const ampm = hora >= 12 ? "pm" : "am";
      const hora12 = hora > 12 ? hora - 12 : hora === 0 ? 12 : hora;
      return `${hora12}:${minutos}${ampm}`;
    } catch {
      return horaStr;
    }
  };

  const toggleDia = (d: string) => {
    setDias((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  // Obtener horario del primer día seleccionado
  const horarioActual = useMemo(() => {
    if (dias.length === 0 || horarios.length === 0) {
      return null;
    }

    const primerDiaSeleccionado = dias[0];
    const nombreDia = diasMap[primerDiaSeleccionado];
    const horario = horarios.find(h => h.dia === nombreDia);

    return horario;
  }, [dias, horarios]);

  // Generar texto de resumen
  const resumenHorario = useMemo(() => {
    if (dias.length === 0 || !horarioActual) {
      return { dias: "Sin selección", horas: "" };
    }

    // Generar texto de días
    let textosDias: string[] = [];
    dias.forEach(letra => {
      const horario = horarios.find(h => h.dia === diasMap[letra]);
      if (horario) {
        textosDias.push(diasMap[letra]);
      }
    });

    const textoDias = textosDias.length > 1
      ? textosDias.join(" y ")
      : textosDias[0] || "Sin días";

    const horaInicio = formatearHora(horarioActual.horaInicio);
    const horaFin = formatearHora(horarioActual.horaFin);

    return {
      dias: textoDias,
      horas: `${horaInicio} -> ${horaFin}`
    };
  }, [dias, horarios, horarioActual]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      closeIcon={<CloseOutlined />}
      styles={{
        body: {
          padding: 20,
          fontSize: 14,
        }
      }}
    >
      <Title
        level={5}
        style={{
          textAlign: "left",
          marginBottom: 24,
          marginTop: -8,
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        Horarios
      </Title>

      <div style={{ marginBottom: 8 }}>
        <Text style={{ color: "#8c8c8c", fontSize: 14 }}>Fecha de inicio: </Text>
        <Text strong style={{ fontSize: 14 }}>{formatearFecha(fechaInicio)}</Text>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text style={{ color: "#8c8c8c", fontSize: 14 }}>Fecha de fin: </Text>
        <Text strong style={{ fontSize: 14 }}>{formatearFecha(fechaFin)}</Text>
      </div>

      <Text style={{ fontSize: 14, display: "block", marginBottom: 6 }}>Días en la semana:</Text>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 12,
          justifyContent: "center",
        }}
      >
        {["D", "L", "M", "X", "J", "V", "S"].map((d) => (
          <Button
            key={d}
            type={dias.includes(d) ? "primary" : "default"}
            size="large"
            onClick={() => toggleDia(d)}
            style={{
              width: 48,
              height: 48,
              background: dias.includes(d) ? "#1677ff" : "#f5f5f5",
              color: dias.includes(d) ? "#fff" : "#595959",
              borderRadius: 8,
              padding: 0,
              fontSize: 16,
              fontWeight: 500,
              border: dias.includes(d) ? "none" : "1px solid #d9d9d9",
            }}
          >
            {d}
          </Button>
        ))}
      </div>

      <div style={{ marginBottom: 6 }}>
        <Text style={{ fontSize: 14, display: "block", marginBottom: 4 }}>Hora de inicio</Text>
        <Text strong style={{ fontSize: 14 }}>
          {horarioActual ? formatearHora(horarioActual.horaInicio) : "-"}
        </Text>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 14, display: "block", marginBottom: 4 }}>Hora de fin:</Text>
        <Text strong style={{ fontSize: 14 }}>
          {horarioActual ? formatearHora(horarioActual.horaFin) : "-"}
        </Text>
      </div>

      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 14 }}>Horario repetido en los días seleccionados:</Text>
        <Checkbox checked />
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 14, display: "block", marginBottom: 6 }}>Convertir hora según país:</Text>
        <Select
          value={pais}
          style={{ width: "100%" }}
          size="large"
          options={[{ value: "Perú", label: "Perú" }]}
        />
      </div>

      <div
        style={{
          background: "#f5f5f5",
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Text strong style={{ fontSize: 15, display: "block", marginBottom: 2 }}>
          {resumenHorario.dias}
        </Text>
        <Text style={{ fontSize: 14 }}>
          {resumenHorario.horas} <strong>PE</strong>
        </Text>
      </div>

      <Button
        type="primary"
        block
        size="large"
        style={{
          marginTop: 0,
          height: 48,
          fontSize: 16,
          fontWeight: 500,
          borderRadius: 8,
        }}
        onClick={onClose}
      >
        Guardar
      </Button>
    </Modal>
  );
};

export default ModalHorarios;
