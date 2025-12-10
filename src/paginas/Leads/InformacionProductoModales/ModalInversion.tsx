import React, { useState, useEffect } from "react";
import { Button, Input, Select, Typography, Modal, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { getCookie } from "../../../utils/cookies";

const { Text, Title } = Typography;

interface Inversion {
  id: number;
  idProducto: number;
  idOportunidad: number;
  costoTotal: number;
  moneda: string;
  descuentoPorcentaje: number;
  descuentoMonto: number | null;
  costoOfrecido: number;
  estado: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  inversion?: Inversion | null;
  idProducto?: number;
  idOportunidad?: number;
  onSave?: () => void;
  onDescuentoChange?: (descuento: number) => void;
}

interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
}

const ModalInversion: React.FC<Props> = ({
  open,
  onClose,
  inversion,
  idProducto,
  idOportunidad,
  onSave,
  onDescuentoChange
}) => {
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [inversionActual, setInversionActual] = useState<Inversion | null>(null);

  // Inicializar el descuento y la inversión actual
  useEffect(() => {
    if (inversion) {
      setDescuentoPorcentaje(inversion.descuentoPorcentaje);
      setInversionActual(inversion);
    } else {
      setDescuentoPorcentaje(5);
      setInversionActual(null);
    }
  }, [inversion, open]);

  // Calcular el costo total y el total con descuento dinámicamente
  const costoTotal = inversionActual?.costoTotal || 0;
  const descuentoMonto = (costoTotal * descuentoPorcentaje) / 100;
  const costoFinal = costoTotal - descuentoMonto;

  // Obtener el usuario del token
  const obtenerUsuarioDelToken = (): string => {
    const token = getCookie("token");
    if (!token) return "SYSTEM";

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded: JwtPayload = JSON.parse(jsonPayload);
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "SYSTEM";
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return "SYSTEM";
    }
  };

  const handleGuardar = async () => {
    if (!idProducto || !idOportunidad) {
      message.error("Faltan datos necesarios para guardar la inversión");
      return;
    }

    setLoading(true);

    try {
      const token = getCookie("token");
      const usuario = obtenerUsuarioDelToken();

      const payload = {
        idProducto: idProducto,
        idOportunidad: idOportunidad,
        DescuentoPorcentaje: descuentoPorcentaje,
        UsuarioModificacion: usuario
      };

      const response = await axios.post(
        "/api/VTAModVentaInversion/ActualizarCostoOfrecido",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("✅ Inversión guardada en el backend:", response.data);

      // Actualizar el estado local con los valores de la respuesta
      if (response.data) {
        const nuevaInversion: Inversion = {
          id: response.data.id,
          idProducto: response.data.idProducto,
          idOportunidad: response.data.idOportunidad,
          costoTotal: response.data.costoTotal,
          moneda: response.data.moneda,
          descuentoPorcentaje: response.data.descuentoAplicado || response.data.descuentoPorcentaje,
          descuentoMonto: null,
          costoOfrecido: response.data.costoOfrecido,
          estado: true,
          fechaCreacion: response.data.fechaCreacion || "",
          usuarioCreacion: usuario,
          fechaModificacion: response.data.fechaModificacion,
          usuarioModificacion: response.data.usuarioModificacionSalida || usuario
        };
        setInversionActual(nuevaInversion);
      }

      message.success("Inversión guardada correctamente");

      // Llamar al callback onSave si existe para refrescar los datos y esperar a que termine
      if (onSave) {
        await onSave();
      }

      // Cerrar el modal después de que todo se haya completado
      onClose();
    } catch (error: any) {
      console.error("Error al guardar la inversión:", error);
      message.error(error.response?.data?.message || "Error al guardar la inversión");
    } finally {
      setLoading(false);
    }
  };

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
      <Input
        size="middle"
        value={`$${costoTotal.toFixed(2)}`}
        readOnly
      />

      <Text>Descuento:</Text>
      <Select
        value={descuentoPorcentaje}
        onChange={(value) => {
          setDescuentoPorcentaje(value);
          if (onDescuentoChange) {
            onDescuentoChange(value);
          }
        }}
        size="middle"
        style={{ width: "100%" }}
        options={[
          { label: "5 %", value: 5 },
          { label: "10 %", value: 10 },
          { label: "15 %", value: 15 },
          { label: "20 %", value: 20 },
          { label: "25 %", value: 25 },
          { label: "30 %", value: 30 },
        ]}
      />

      <Text>Total:</Text>
      <Input
        size="middle"
        value={`$${costoFinal.toFixed(2)}`}
        readOnly
      />

      <div
        style={{
          background: "#f7f7f7",
          padding: 10,
          borderRadius: 6,
          textAlign: "center",
        }}
      >
        <Text>${costoTotal.toFixed(2)} menos {descuentoPorcentaje}% de descuento</Text>
        <br />
        <Text strong>Total ${costoFinal.toFixed(2)}</Text>
      </div>

      <Button
        type="primary"
        block
        size="middle"
        onClick={handleGuardar}
        loading={loading}
      >
        Guardar
      </Button>
    </Modal>
  );
};

export default ModalInversion;
