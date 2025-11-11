import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Card,
  Divider,
  Form,
  Select,
  message,
  Space,
  Row,
  Col,
  DatePicker,
  TimePicker,
  Empty,
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

interface Cliente {
  id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  celular: string;
  prefijoPaisCelular: string;
  idPais: number;
  paisNombre?: string;
  industria?: string;
  areaTrabajo?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ModalAgregarOportunidad({ open, onClose }: Props) {
  const [fase, setFase] = useState<1 | 2 | 3>(1);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState("");
  const [resultados, setResultados] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fecha, setFecha] = useState<any>(null);
  const [hora, setHora] = useState<any>(null);
  const [lanzamiento, setLanzamiento] = useState("");

 const paises: Record<number, string> = {
  1: "Angola",
  2: "Argentina",
  3: "Aruba",
  4: "Belice",
  5: "Bolivia",
  6: "Brasil",
  7: "Canada",
  8: "Chile",
  9: "Colombia",
  10: "Costa Rica",
  11: "Cuba",
  12: "Ecuador",
  13: "El Salvador",
  14: "España",
  15: "Estados Unidos",
  16: "Guatemala",
  17: "Guyana",
  18: "Haití",
  19: "Honduras",
  20: "Italia",
  21: "Kuwait",
  22: "México",
  23: "Nicaragua",
  24: "Panamá",
  25: "Paraguay",
  26: "Perú",
  27: "Puerto Rico",
  28: "República Dominicana",
  29: "Trinidad y Tobago",
  30: "United States",
  31: "Uruguay",
  32: "Venezuela",
};

  // === Cargar clientes al abrir modal ===
  useEffect(() => {
    if (open) {
      setFase(1);
      const token = Cookies.get("token");
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/VTAModVentaPersona/ObtenerTodas`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setClientes(res.data.persona || []);
          console.log("✅ Clientes obtenidos:", res.data);
        })
        .catch((err) => {
          console.error(err);
          message.error("Error al obtener clientes");
        });
    }
  }, [open]);

  // === Filtro de búsqueda ===
  useEffect(() => {
  if (filtro.trim().length < 5) {
    setResultados([]);
    return;
  }
  

  const normalizar = (t: string) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const f = normalizar(filtro.trim());

  const filtrados = clientes
    .filter((c) => {
      const fullName = normalizar(`${c.nombres} ${c.apellidos}`);
      return fullName.includes(f);
    })
    .slice(0, 5);

  setResultados(filtrados);
}, [filtro, clientes]);
  // === Crear cliente (fase 2) ===
  const handleCrearCliente = async () => {
  try {
    const token = Cookies.get("token");
    const values = await form.validateFields();

    setLoading(true);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/VTAModVentaPersona/Insertar`,
      { ...values, estado: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    message.success("Cliente creado correctamente");

    // 🔹 Aseguramos que el cliente tenga todos los datos para la fase 3
    const nuevoCliente: Cliente = {
      id: res.data?.id || 0,
      nombres: values.nombres,
      apellidos: values.apellidos,
      correo: values.correo,
      celular: values.celular,
      prefijoPaisCelular:
        clientes.find((x) => x.idPais === values.idPais)?.prefijoPaisCelular ||
        "+00",
      idPais: values.idPais,
      paisNombre: paises[values.idPais],
      industria: values.industria,
      areaTrabajo: values.areaTrabajo,
    };

    setClienteSeleccionado(nuevoCliente);
    setFase(3);
  } catch (error) {
    console.error(error);
    message.error("Error al crear el cliente");
  } finally {
    setLoading(false);
  }
};


  // === Crear oportunidad (fase 3) ===
  // === Crear oportunidad (fase 3) ===
const handleCrearOportunidad = async () => {
  if (!clienteSeleccionado) return;
  if (!lanzamiento.trim()) {
    message.warning("Ingrese un código de lanzamiento");
    return;
  }

  try {
    setLoading(true);
    const token = Cookies.get("token");

    const body = {
      idPersona: clienteSeleccionado.id,
      codigoLanzamiento: lanzamiento.trim(),
      estado: true,
    };

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/VTAModVentaOportunidad/Insertar`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    message.success("Oportunidad creada correctamente");
    onClose();
  } catch (error) {
    console.error(error);
    message.error("Error al crear la oportunidad");
  } finally {
    setLoading(false);
  }
};


  const fechaFormateada = fecha
    ? dayjs(fecha).locale("es").format("dddd, DD [de] MMMM [de] YYYY")
    : "";
  const horaFormateada = hora ? dayjs(hora).format("HH:mm") : "";
  const iso =
    fecha && hora
      ? dayjs(fecha)
          .hour(dayjs(hora).hour())
          .minute(dayjs(hora).minute())
          .second(0)
          .toISOString()
      : "";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
      title={
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>
          {fase === 1
            ? "Seleccionar cliente"
            : fase === 2
            ? "Crear cliente"
            : "Crear oportunidad"}
        </h3>
      }
    >
      <Divider style={{ margin: "8px 0 16px 0" }} />

      {/* === FASE 1 === */}
      {fase === 1 && (
        <div>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Buscar cliente..."
            allowClear
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          {filtro.trim().length === 0 && (
            <Empty
              description={
                <span>
                  Escribe al menos <b>5 letras</b> para iniciar la búsqueda
                </span>
              }
            />
          )}

          {filtro.trim().length >= 5 && resultados.length === 0 && (
            <Empty description="No se encontraron coincidencias" />
          )}

          {resultados.length > 0 && (
            <div
              style={{
                maxHeight: 300,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {resultados.map((c) => (
                <Card
                  key={c.id}
                  onClick={() => {
                    setClienteSeleccionado(c);
                    setFase(3);
                  }}
                  hoverable
                  style={{
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <div style={{ fontWeight: 700 }}>
                      {c.nombres} {c.apellidos}
                    </div>
                    <div>
                      <b>{c.prefijoPaisCelular}</b> {c.celular} -{" "}
                      <b>{paises[c.idPais] || "Sin país"}</b>
                    </div>
                    <div>{c.correo}</div>
                    <Card
                      style={{
                        background: "#1677ff",
                        color: "#fff",
                        borderRadius: 6,
                        textAlign: "center",
                        marginTop: 6,
                      }}
                      bodyStyle={{ padding: "6px" }}
                    >
                      Oportunidades relacionadas: 3
                    </Card>
                  </Space>
                </Card>
              ))}
            </div>
          )}

          <Divider style={{ margin: "16px 0" }} />

          <Button
            block
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#1677ff", height: 40, fontWeight: 500 }}
            onClick={() => setFase(2)}
          >
            Crear nuevo cliente
          </Button>
        </div>
      )}

      {/* === FASE 2 === */}
      {fase === 2 && (
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nombres" label="Nombres" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="apellidos" label="Apellidos" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="celular" label="Celular" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="idPais" label="País" rules={[{ required: true }]}>
                <Select placeholder="Seleccione un país">
                  {Object.entries(paises).map(([id, nombre]) => (
                    <Option key={id} value={Number(id)}>
                      {nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="correo" label="Correo">
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="industria" label="Industria" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="areaTrabajo" label="Área de trabajo" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          

          <Divider style={{ margin: "16px 0" }} />

          <Button
            block
            type="primary"
            icon={<PlusOutlined />}
            loading={loading}
            style={{ backgroundColor: "#1677ff", height: 40, fontWeight: 500 }}
            onClick={handleCrearCliente}
          >
            Guardar cliente
          </Button>
        </Form>
      )}

      {/* === FASE 3 === */}
      {fase === 3 && clienteSeleccionado && (
        <div>
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              marginBottom: 16,
            }}
          >
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <div style={{ fontWeight: 700 }}>
                {clienteSeleccionado.nombres} {clienteSeleccionado.apellidos}
              </div>
              <div>
                <b>{clienteSeleccionado.prefijoPaisCelular}</b>{" "}
                {clienteSeleccionado.celular} -{" "}
                <b>{paises[clienteSeleccionado.idPais] || "Sin país"}</b>
              </div>
              <div>{clienteSeleccionado.correo}</div>
              <Card
                style={{
                  background: "#1677ff",
                  color: "#fff",
                  borderRadius: 6,
                  textAlign: "center",
                  marginTop: 6,
                }}
                bodyStyle={{ padding: "6px" }}
              >
                Oportunidades relacionadas: 3
              </Card>
            </Space>
          </Card>

          <Form layout="vertical">
            <Form.Item label="Lanzamiento">
              <Input
                value={lanzamiento}
                onChange={(e) => setLanzamiento(e.target.value)}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Fecha">
                  <DatePicker
                    value={fecha}
                    onChange={setFecha}
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Hora">
                  <TimePicker
                    value={hora}
                    onChange={setHora}
                    format="HH:mm"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {fecha && hora && (
            <Card
              style={{
                background: "#f0f0f0",
                borderRadius: 6,
                marginTop: 8,
              }}
            >
              <div>
                <b>Programado para:</b> {fechaFormateada} a las {horaFormateada} horas
              </div>
              <div>ISO: {iso}</div>
            </Card>
          )}

          <Divider style={{ margin: "16px 0" }} />

          <Button
            block
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#1677ff", height: 40, fontWeight: 500 }}
            onClick={handleCrearOportunidad}
          >
            Crear oportunidad
          </Button>
        </div>
      )}
    </Modal>
  );
}
