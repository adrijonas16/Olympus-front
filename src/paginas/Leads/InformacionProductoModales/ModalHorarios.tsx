import React, { useState, useMemo, useEffect } from "react";
import { Button, Checkbox, Select, Typography, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

const { Text, Title } = Typography;

// Mapeo de países con sus zonas horarias y códigos
const PAISES_ZONAS_HORARIAS: Record<string, { timezone: string; codigo: string }> = {
  "Perú": { timezone: "America/Lima", codigo: "PE" },
  "Argentina": { timezone: "America/Argentina/Buenos_Aires", codigo: "AR" },
  "Bolivia": { timezone: "America/La_Paz", codigo: "BO" },
  "Brasil": { timezone: "America/Sao_Paulo", codigo: "BR" },
  "Chile": { timezone: "America/Santiago", codigo: "CL" },
  "Colombia": { timezone: "America/Bogota", codigo: "CO" },
  "Costa Rica": { timezone: "America/Costa_Rica", codigo: "CR" },
  "Cuba": { timezone: "America/Havana", codigo: "CU" },
  "Ecuador": { timezone: "America/Guayaquil", codigo: "EC" },
  "El Salvador": { timezone: "America/El_Salvador", codigo: "SV" },
  "España": { timezone: "Europe/Madrid", codigo: "ES" },
  "Estados Unidos": { timezone: "America/New_York", codigo: "US" },
  "Guatemala": { timezone: "America/Guatemala", codigo: "GT" },
  "Honduras": { timezone: "America/Tegucigalpa", codigo: "HN" },
  "México": { timezone: "America/Mexico_City", codigo: "MX" },
  "Nicaragua": { timezone: "America/Managua", codigo: "NI" },
  "Panamá": { timezone: "America/Panama", codigo: "PA" },
  "Paraguay": { timezone: "America/Asuncion", codigo: "PY" },
  "Puerto Rico": { timezone: "America/Puerto_Rico", codigo: "PR" },
  "República Dominicana": { timezone: "America/Santo_Domingo", codigo: "DO" },
  "Uruguay": { timezone: "America/Montevideo", codigo: "UY" },
  "Venezuela": { timezone: "America/Caracas", codigo: "VE" },
};

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

  // Función para convertir hora según zona horaria del país
  const convertirHoraPorPais = (horaStr: string, paisOrigen: string = "Perú", paisDestino: string): string => {
    if (!horaStr) return "-";
    try {
      const [horas, minutos] = horaStr.split(":");

      const timezoneOrigen = PAISES_ZONAS_HORARIAS[paisOrigen]?.timezone || "America/Lima";
      const timezoneDestino = PAISES_ZONAS_HORARIAS[paisDestino]?.timezone || "America/Lima";

      // Si es la misma zona horaria, no convertir
      if (timezoneOrigen === timezoneDestino) {
        return formatearHora(horaStr);
      }

      // Crear fecha con la hora en la zona horaria de origen
      const hoy = new Date();
      const fechaLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), parseInt(horas), parseInt(minutos));

      // Convertir la hora local del país origen a UTC
      const fechaUTC = fromZonedTime(fechaLocal, timezoneOrigen);

      // Convertir de UTC a la zona horaria destino
      const fechaDestino = toZonedTime(fechaUTC, timezoneDestino);

      // Formatear a 12 horas
      const hora = fechaDestino.getHours();
      const minuto = String(fechaDestino.getMinutes()).padStart(2, "0");
      const ampm = hora >= 12 ? "pm" : "am";
      const hora12 = hora > 12 ? hora - 12 : hora === 0 ? 12 : hora;

      return `${hora12}:${minuto}${ampm}`;
    } catch (error) {
      console.error("Error al convertir hora:", error);
      return formatearHora(horaStr);
    }
  };

  const toggleDia = (d: string) => {
    setDias((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  // Obtener horario del primer día seleccionado (para mostrar en los campos individuales)
  const horarioActual = useMemo(() => {
    if (dias.length === 0 || horarios.length === 0) {
      return null;
    }

    const primerDiaSeleccionado = dias[0];
    const nombreDia = diasMap[primerDiaSeleccionado];
    const horario = horarios.find(h => h.dia === nombreDia);

    return horario;
  }, [dias, horarios]);

  // Generar texto de resumen - SIEMPRE basado en los días originales del JSON
  const resumenHorario = useMemo(() => {
    if (diasConHorario.length === 0 || horarios.length === 0) {
      return { dias: "Sin selección", horas: "", codigo: "PE" };
    }

    // Usar los días ORIGINALES del JSON, no los seleccionados por el usuario
    let textosDias: string[] = [];
    diasConHorario.forEach(letra => {
      const horario = horarios.find(h => h.dia === diasMap[letra]);
      if (horario) {
        textosDias.push(diasMap[letra]);
      }
    });

    const textoDias = textosDias.length > 1
      ? textosDias.join(" y ")
      : textosDias[0] || "Sin días";

    // Usar el primer horario del JSON para el resumen
    const primerHorario = horarios[0];
    const horaInicio = convertirHoraPorPais(primerHorario.horaInicio, "Perú", pais);
    const horaFin = convertirHoraPorPais(primerHorario.horaFin, "Perú", pais);
    const codigoPais = PAISES_ZONAS_HORARIAS[pais]?.codigo || "PE";

    return {
      dias: textoDias,
      horas: `${horaInicio} -> ${horaFin}`,
      codigo: codigoPais
    };
  }, [diasConHorario, horarios, pais]);

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
        {["D", "L", "M", "X", "J", "V", "S"].map((d) => {
          const estaEnJSON = diasConHorario.includes(d);
          const estaSeleccionado = dias.includes(d);
          return (
            <Button
              key={d}
              type={estaSeleccionado ? "primary" : "default"}
              size="large"
              disabled={!estaEnJSON}
              onClick={() => estaEnJSON && toggleDia(d)}
              style={{
                width: 48,
                height: 48,
                background: estaSeleccionado ? "#1677ff" : "#f5f5f5",
                color: estaSeleccionado ? "#fff" : "#595959",
                borderRadius: 8,
                padding: 0,
                fontSize: 16,
                fontWeight: 500,
                border: estaSeleccionado ? "none" : "1px solid #d9d9d9",
                cursor: estaEnJSON ? "pointer" : "not-allowed",
                opacity: estaEnJSON ? 1 : 0.5,
              }}
            >
              {d}
            </Button>
          );
        })}
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
          onChange={(value) => setPais(value)}
          style={{ width: "100%" }}
          size="large"
          showSearch
          placeholder="Selecciona un país"
          optionFilterProp="label"
          options={Object.keys(PAISES_ZONAS_HORARIAS).sort().map(nombrePais => ({
            value: nombrePais,
            label: `${nombrePais} (${PAISES_ZONAS_HORARIAS[nombrePais].codigo})`
          }))}
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
          {resumenHorario.horas} <strong>{resumenHorario.codigo}</strong>
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
