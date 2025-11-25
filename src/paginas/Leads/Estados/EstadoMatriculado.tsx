import React, { useState } from "react";
import {
  Typography,
  Tag,
  Row,
  Col,
  Input,
  Button,
  Space,
  Table,
  Select,
  DatePicker,
  message,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getCookie } from "../../../utils/cookies";
import dayjs from "dayjs";

const { Text } = Typography;

const baseUrl = "http://localhost:7020";

const EstadoMatriculado: React.FC = () => {
  const [tabActivo, setTabActivo] = useState<"cobranza" | "convertido">(
    "cobranza"
  );

  const [numCuotas, setNumCuotas] = useState<string>("");
  const [bloquearSelect, setBloquearSelect] = useState<boolean>(false);
  const [idPlan, setIdPlan] = useState<number | null>(null);
  const [cuotas, setCuotas] = useState<any[]>([]);
  const [metodoPorFila, setMetodoPorFila] = useState<
    Record<number, number | "">
  >({});

  // ======================================================
  // API: Crear plan
  // ======================================================
  const crearPlanCobranza = async (numCuotas: number) => {
    try {
      const token = getCookie("token");
      const url = `${baseUrl}/api/Cobranza/Plan`;
      const body = {
        IdOportunidad: 2,
        Total: 1000,
        NumCuotas: numCuotas,
        FechaInicio: "2025-12-01T00:00:00",
        FrecuenciaDias: 30,
        Usuario: "SYSTEM",
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        message.error("Error al crear plan");
        return null;
      }

      const data = await res.json();
      return data.newPlanId;
    } catch (error) {
      message.error("Error creando plan");
      return null;
    }
  };

  // ======================================================
  // API: Obtener cuotas
  // ======================================================
  const obtenerCuotasPlan = async (idPlan: number) => {
    try {
      const token = getCookie("token");
      const url = `${baseUrl}/api/Cobranza/Plan/${idPlan}/Cuotas`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        message.error("Error al obtener cuotas");
        return [];
      }

      const data = await res.json();
      return data.cuotas || [];
    } catch (error) {
      message.error("Error al obtener cuotas");
      return [];
    }
  };

  // ======================================================
  // API: Pagar cuota
  // ======================================================
  const pagarCuotaAPI = async ({
    idPlan,
    idCuota,
    monto,
    metodo,
    fechaPago,
  }: {
    idPlan: number;
    idCuota: number;
    monto: number;
    metodo: number;
    fechaPago: string;
  }) => {
    try {
      const token = getCookie("token");
      const url = `${baseUrl}/api/Cobranza/Pago?acumulada=false`;

      const body = {
        IdCobranzaPlan: idPlan,
        IdCuotaInicial: idCuota,
        MontoPago: monto,
        IdMetodoPago: metodo,
        FechaPago: fechaPago,
        Usuario: "SYSTEM",
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) return { ok: false };

      const data = await res.json();
      return { ok: true, pagoId: data.pagoId };
    } catch (error) {
      return { ok: false };
    }
  };

  // ======================================================
  // Generar plan + cargar cuotas
  // ======================================================
  const handleSeleccionCuotas = async () => {
    if (!numCuotas || numCuotas === "") {
      message.warning("Selecciona el número de cuotas");
      return;
    }

    const cantidad = Number(numCuotas);
    const id = await crearPlanCobranza(cantidad);
    if (!id) return;

    setIdPlan(id);
    setBloquearSelect(true);

    const cuotasBack = await obtenerCuotasPlan(id);

    const sistemaHoy = dayjs().format("YYYY-MM-DD");

    const formateadas = cuotasBack.map((c: any) => ({
      key: c.id,
      id: c.id,
      numero: c.numero,
      fechaVencimiento: c.fechaVencimiento?.split("T")[0] ?? "",
      monto: c.montoProgramado,
      abonado: c.montoPagado ?? 0,
      pendiente: (c.montoProgramado ?? 0) - (c.montoPagado ?? 0),
      fechaPago: sistemaHoy,
    }));

    const metInit: Record<number, number | ""> = {};
    formateadas.forEach((f: any) => (metInit[f.id] = ""));
    setMetodoPorFila(metInit);

    setCuotas(formateadas);
  };

  // ======================================================
  // Editar monto abonado
  // ======================================================
  const handleMontoChange = (id: number, value: string) => {
    const n = Number(value) || 0;

    const nuevo = cuotas.map((c) =>
      c.id === id
        ? {
            ...c,
            abonado: n,
            pendiente: Math.max(0, (c.monto ?? 0) - n),
          }
        : c
    );

    setCuotas(nuevo);
  };

  // ======================================================
  // Cambiar método
  // ======================================================
  const handleMetodoChangeFila = (id: number, valor: number | "") => {
    setMetodoPorFila((prev) => ({ ...prev, [id]: valor }));
  };

  // ======================================================
  // Cambiar fecha de pago
  // ======================================================
  const handleFechaPagoChange = (id: number, date: any) => {
    const nuevo = cuotas.map((c) =>
      c.id === id ? { ...c, fechaPago: date.format("YYYY-MM-DD") } : c
    );
    setCuotas(nuevo);
  };

  // ======================================================
  // Confirmar TODOS los pagos
  // ======================================================
  const handleConfirmarPagos = async () => {
    if (!idPlan) {
      message.warning("Primero genera el plan");
      return;
    }

    const filas = cuotas.filter((c) => (c.abonado ?? 0) > 0);

    if (filas.length === 0) {
      message.info("No hay cuotas abonadas");
      return;
    }

    const sinMetodo = filas.find((f) => !metodoPorFila[f.id]);
    if (sinMetodo) {
      message.warning(
        "Selecciona método de pago para todas las cuotas abonadas"
      );
      return;
    }

    let errores = 0;

    for (const fila of filas) {
      const metodo = metodoPorFila[fila.id] as number;
      const fechaPagoISO = dayjs(fila.fechaPago).toISOString();

      const resp = await pagarCuotaAPI({
        idPlan,
        idCuota: fila.id,
        monto: fila.abonado,
        metodo,
        fechaPago: fechaPagoISO,
      });

      if (!resp.ok) errores++;
    }

    if (errores === 0) message.success("Pagos confirmados");
    else message.error(`Fallaron ${errores} pagos`);

    const nuevas = await obtenerCuotasPlan(idPlan);

    const formateadas = nuevas.map((c: any) => ({
      key: c.id,
      id: c.id,
      numero: c.numero,
      fechaVencimiento: c.fechaVencimiento?.split("T")[0],
      monto: c.montoProgramado,
      abonado: c.montoPagado ?? 0,
      pendiente: (c.montoProgramado ?? 0) - (c.montoPagado ?? 0),
      fechaPago: c.fechaPago
        ? c.fechaPago.split("T")[0]
        : dayjs().format("YYYY-MM-DD"),
    }));
    setCuotas(formateadas);
  };

  // ======================================================
  // Columnas
  // ======================================================
  const columnsCobranza = [
    {
      title: "N°",
      dataIndex: "numero",
      width: 55,
      render: (v: any) => <span style={{ fontSize: 10 }}>{v}</span>,
    },

    {
      title: "Vence",
      dataIndex: "fechaVencimiento",
      width: 95,
      render: (v: any) => <span style={{ fontSize: 10 }}>{v}</span>,
    },

    {
      title: "Monto",
      dataIndex: "monto",
      width: 80,
      render: (v: any) => (
        <span style={{ fontSize: 10 }}>$ {v.toFixed(2)}</span>
      ),
    },

    {
      title: "Abonado",
      dataIndex: "abonado",
      width: 110,
      render: (_: any, row: any) => (
        <Input
          type="number"
          min={0}
          value={row.abonado}
          onChange={(e) => handleMontoChange(row.id, e.target.value)}
          style={{ width: 90, fontSize: 10, height: 24 }}
        />
      ),
    },

    {
      title: "Pend.",
      dataIndex: "pendiente",
      width: 80,
      render: (v: number) => (
        <span style={{ fontSize: 10 }}>$ {v.toFixed(2)}</span>
      ),
    },

    {
      title: "Método",
      dataIndex: "metodoPago",
      width: 120,
      render: (_: any, row: any) => (
        <Select
          placeholder="Método"
          value={metodoPorFila[row.id] ?? ""}
          onChange={(val) => handleMetodoChangeFila(row.id, val as number)}
          size="small"
          style={{
            width: 90,
            fontSize: 10,
          }}
          dropdownStyle={{ fontSize: 10 }}
        >
          <Select.Option value="">Seleccionar</Select.Option>
          <Select.Option value={1}>Yape</Select.Option>
          <Select.Option value={2}>Plin</Select.Option>
          <Select.Option value={3}>Efectivo</Select.Option>
          <Select.Option value={4}>Transf.</Select.Option>
        </Select>
      ),
    },

    {
      title: "Pago",
      dataIndex: "fechaPago",
      width: 130,
      render: (v: string, row: any) => (
        <DatePicker
          size="small"
          value={row.fechaPago ? dayjs(row.fechaPago) : null}
          onChange={(d) => handleFechaPagoChange(row.id, d)}
          format="YYYY-MM-DD"
          style={{
            width: 100,
            fontSize: 10,
          }}
          inputReadOnly
        />
      ),
    },
  ];

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div
      style={{
        background: "#F0F0F0",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* OCURRENCIA */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 12 }}>Ocurrencia:</Text>

        <Space>
          <Tag
            color={tabActivo === "cobranza" ? "#B8F3B8" : "#D1D1D1"}
            style={{ cursor: "pointer", fontSize: 10 }}
            onClick={() => setTabActivo("cobranza")}
          >
            Cobranza
          </Tag>

          <Tag
            color={tabActivo === "convertido" ? "#B8F3B8" : "#D1D1D1"}
            style={{ cursor: "pointer", fontSize: 10 }}
            onClick={() => setTabActivo("convertido")}
          >
            Convertido
          </Tag>
        </Space>
      </Row>

      {/* INFORMACIÓN */}
      <div
        style={{
          background: "#ECECEC",
          borderRadius: 10,
          padding: "6px 8px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <InfoCircleOutlined style={{ color: "#5D5D5D", fontSize: 12 }} />
        <Text style={{ fontSize: 9, color: "#5D5D5D" }}>
          Para pasar a Convertido el cliente debe completar sus pagos
        </Text>
      </div>

      {/* TAB COBRANZA */}
      {tabActivo === "cobranza" ? (
        <div
          style={{
            background: "#FFF",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text strong style={{ fontSize: 12 }}>
            Cobranza
          </Text>

          {/* SELECT DE CUOTAS */}
          <Space style={{ marginTop: 10, width: "100%" }} direction="vertical">
            <Select
              placeholder="Seleccionar"
              style={{ width: "100%", fontSize: 10 }}
              value={numCuotas}
              onChange={(v) => setNumCuotas(v)}
              options={[
                { value: "", label: "Seleccionar" },
                ...Array.from({ length: 12 }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: `${i + 1}`,
                })),
              ]}
              disabled={bloquearSelect}
            />

            <Button
              type="primary"
              block
              onClick={handleSeleccionCuotas}
              disabled={bloquearSelect}
              style={{ fontSize: 10, height: 28 }}
            >
              Generar plan de cuotas
            </Button>
          </Space>

          <Table
            columns={columnsCobranza}
            dataSource={cuotas}
            pagination={false}
            size="small"
            style={{ marginTop: 12, fontSize: 10 }}
            rowKey="id"
          />

          {/* BOTÓN CENTRADO */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button
              type="primary"
              onClick={handleConfirmarPagos}
              style={{ fontSize: 10 }}
            >
              Confirmar pago de cuotas
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#FFF",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text strong style={{ fontSize: 12 }}>
            Convertido
          </Text>

          <Row gutter={8} style={{ marginTop: 10 }}>
            <Col span={6}>
              <Input prefix="$" disabled value="100" style={{ fontSize: 10 }} />
            </Col>
            <Col span={6}>
              <Input prefix="$" disabled value="0" style={{ fontSize: 10 }} />
            </Col>
            <Col span={6}>
              <Input prefix="$" disabled value="100" style={{ fontSize: 10 }} />
            </Col>
            <Col span={6}>
              <Input disabled value="26-09-2025" style={{ fontSize: 10 }} />
            </Col>
          </Row>

          <Button type="primary" block style={{ marginTop: 12, fontSize: 10 }}>
            Confirmar pago
          </Button>
        </div>
      )}
    </div>
  );
};

export default EstadoMatriculado;
