import React, { useState, useEffect } from "react";
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

type CuotaRow = {
  key: number;
  id: number;
  numero: number;
  fechaVencimiento: string;
  monto: number;
  abonado: number;
  pendiente: number;
  fechaPago: string;
  deshabilitado: boolean;
};

const EstadoMatriculado: React.FC<{
  oportunidadId: number;
  onCreado: () => void;
  origenOcurrenciaId?: number | null;
  activo: boolean;
}> = ({ oportunidadId, onCreado }) => {
  const [tabActivo, setTabActivo] = useState<"cobranza" | "convertido">(
    "cobranza"
  );

  const [numCuotas, setNumCuotas] = useState<string>("");
  const [bloquearSelect, setBloquearSelect] = useState<boolean>(false);
  const [idPlan, setIdPlan] = useState<number | null>(null);
  const [cuotas, setCuotas] = useState<CuotaRow[]>([]);
  const [metodoPorFila, setMetodoPorFila] = useState<
    Record<number, number | "">
  >({});
  const [puedeConvertir, setPuedeConvertir] = useState<boolean>(false);

  // ======================================================
  // Función: valida si todas las cuotas están pagadas
  // ======================================================
  const validarSiPuedeConvertir = (lista: CuotaRow[]) => {
    const todasPagadas = lista.every((c) => c.pendiente <= 0);
    setPuedeConvertir(todasPagadas);
  };

  // ======================================================
  // API: Obtener plan por oportunidad
  // ======================================================
  const obtenerPlanPorOportunidad = async (idOportunidad: number) => {
    try {
      const token = getCookie("token");
      const url = `${baseUrl}/api/Cobranza/Plan/PorOportunidad/${idOportunidad}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { accept: "*/*", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return null;

      const data = await res.json();
      if (!data.plan || !data.plan.plan) return null;

      return {
        ...data.plan.plan,
        cuotas: data.plan.cuotas ?? [],
      };
    } catch {
      return null;
    }
  };

  // ======================================================
  // API: Crear plan
  // ======================================================
  const crearPlanCobranza = async (numCuotas: number) => {
    try {
      const token = getCookie("token");
      const url = `${baseUrl}/api/Cobranza/Plan`;

      const body = {
        IdOportunidad: oportunidadId,
        Total: 1000,
        NumCuotas: numCuotas,
        FechaInicio: dayjs().format("YYYY-MM-DD"),
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

      if (!res.ok) return null;

      const data = await res.json();
      return data.newPlanId;
    } catch {
      return null;
    }
  };

  // ======================================================
  // API: Obtener cuotas
  // ======================================================
  const obtenerCuotasPlan = async (planId: number) => {
    try {
      const token = getCookie("token");
      const url = `${baseUrl}/api/Cobranza/Plan/${planId}/Cuotas`;

      const res = await fetch(url, {
        method: "GET",
        headers: { accept: "*/*", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return [];

      const data = await res.json();
      return data.cuotas || [];
    } catch {
      return [];
    }
  };

  // ======================================================
  // Normalización
  // ======================================================
  const mapearCuotas = (listaBackend: any[]): CuotaRow[] => {
    const hoy = dayjs().startOf("day");

    return listaBackend.map((c: any) => {
      const fechaV = (c.fechaVencimiento ?? "").split("T")[0];
      const fechaVenc = dayjs(fechaV);

      const monto = Number(c.montoProgramado ?? 0);
      const pagado = Number(c.montoPagado ?? 0);
      const pendiente = monto - pagado;

      return {
        key: c.id,
        id: c.id,
        numero: c.numero,
        fechaVencimiento: fechaVenc.format("YYYY-MM-DD"),
        monto,
        abonado: pagado,
        pendiente,
        fechaPago: c.fechaPago
          ? c.fechaPago.split("T")[0]
          : hoy.format("YYYY-MM-DD"),
        deshabilitado: pendiente <= 0 || hoy.isAfter(fechaVenc),
      };
    });
  };

  // ======================================================
  // Cargar plan existente
  // ======================================================
  const cargarPlanExistente = async (plan: any) => {
    setIdPlan(plan.id);
    setNumCuotas(String(plan.numCuotas));
    setBloquearSelect(true);

    const cuotasNormalizadas = mapearCuotas(plan.cuotas);
    setCuotas(cuotasNormalizadas);
    validarSiPuedeConvertir(cuotasNormalizadas);

    const metInit: Record<number, number | ""> = {};
    cuotasNormalizadas.forEach((f) => (metInit[f.id] = ""));
    setMetodoPorFila(metInit);
  };

  // ======================================================
  // Efecto inicial
  // ======================================================
  useEffect(() => {
    const cargar = async () => {
      const plan = await obtenerPlanPorOportunidad(oportunidadId);
      if (plan) cargarPlanExistente(plan);
    };
    cargar();
  }, [oportunidadId]);

  // ======================================================
  // Cambios en cuotas
  // ======================================================
  const handleMontoChange = (id: number, value: string) => {
    const nuevoMonto = Number(value) || 0;

    const nuevas = cuotas.map((c) =>
      c.id === id ? { ...c, abonado: nuevoMonto } : c
    );

    setCuotas(nuevas);
  };

  const handleMetodoChangeFila = (id: number, val: number | "") => {
    setMetodoPorFila((prev) => ({ ...prev, [id]: val }));
  };

  const handleFechaPagoChange = (id: number, date: any) => {
    if (!date) return;

    const nuevas = cuotas.map((c) =>
      c.id === id ? { ...c, fechaPago: date.format("YYYY-MM-DD") } : c
    );
    setCuotas(nuevas);
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

      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  // ======================================================
  // Confirmar pagos
  // ======================================================
  const handleConfirmarPagos = async () => {
    if (!idPlan) return;

    const filas = cuotas.filter(
      (c) => c.abonado > 0 && !c.deshabilitado
    );

    if (filas.length === 0) {
      message.info("No hay cuotas abonadas");
      return;
    }

    for (const fila of filas) {
      if (!metodoPorFila[fila.id]) {
        message.warning(
          `Selecciona un método para la cuota Nº ${fila.numero}`
        );
        return;
      }
    }

    // Pagar una por una
    for (const f of filas) {
      await pagarCuotaAPI({
        idPlan,
        idCuota: f.id,
        monto: f.abonado,
        metodo: metodoPorFila[f.id] as number,
        fechaPago: dayjs(f.fechaPago).toISOString(),
      });
    }

    message.success("Pagos confirmados");

    // Recargar cuotas
    const nuevas = await obtenerCuotasPlan(idPlan);
    const normalizadas = mapearCuotas(nuevas);
    setCuotas(normalizadas);
    validarSiPuedeConvertir(normalizadas);
  };

  // ======================================================
  // API: Cambiar a convertido
  // ======================================================
  const registrarConvertido = async () => {
    if (!puedeConvertir) {
      message.warning("Primero debe completar todas las cuotas.");
      return;
    }

    try {
      const token = getCookie("token");
      const url = `${baseUrl}/api/VTAModVentaHistorialEstado/${oportunidadId}/crearConOcurrencia`;

      const res = await fetch(url, {
        method: "POST",
        headers: { accept: "*/*", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        message.error("No se pudo cambiar a Convertido");
        return;
      }

      message.success("Estado actualizado a Convertido");
      onCreado();
      setTabActivo("convertido");
    } catch {
      message.error("Error al actualizar estado");
    }
  };

  // ======================================================
  // TABLAS
  // ======================================================
  const columnsCobranza = [
    {
      title: "N°",
      dataIndex: "numero",
      width: 55,
      render: (v: any, row: CuotaRow) => (
        <span style={{ fontSize: 10 }}>{v}</span>
      ),
    },
    {
      title: "Vence",
      dataIndex: "fechaVencimiento",
      width: 95,
    },
    {
      title: "Monto",
      dataIndex: "monto",
      width: 80,
      render: (v: any) => `$ ${Number(v).toFixed(2)}`,
    },
    {
      title: "Abonado",
      width: 110,
      render: (_: any, row: CuotaRow) => (
        <Input
          type="number"
          value={row.abonado}
          disabled={row.deshabilitado}
          onChange={(e) => handleMontoChange(row.id, e.target.value)}
          style={{ fontSize: 10, height: 24 }}
        />
      ),
    },
    {
      title: "Pend.",
      width: 80,
      render: (v: any, row: CuotaRow) => `$ ${row.pendiente}`,
    },
    {
      title: "Método",
      width: 120,
      render: (_: any, row: CuotaRow) => (
        <Select
          value={metodoPorFila[row.id]}
          onChange={(v) => handleMetodoChangeFila(row.id, v)}
          disabled={row.deshabilitado}
          style={{ width: 90, fontSize: 10 }}
          size="small"
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
      width: 130,
      render: (v: string, row: CuotaRow) => (
        <DatePicker
          size="small"
          value={dayjs(row.fechaPago)}
          onChange={(d) => d && handleFechaPagoChange(row.id, d)}
          disabled={row.deshabilitado}
          format="YYYY-MM-DD"
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
      {/* TABAS */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 12 }}>Ocurrencia:</Text>

        <Space>
          {/* COBRANZA */}
          <Tag
            color={tabActivo === "cobranza" ? "#B8F3B8" : "#D1D1D1"}
            style={{ cursor: "pointer" , color: "black"}}
            onClick={() => setTabActivo("cobranza")}
          >
            Cobranza
          </Tag>

          {/* CONVERTIDO — SOLO SI TODAS PAGADAS */}
          <Tag
            color={puedeConvertir ? "#B8F3B8" : "#D1D1D1"}
            style={{ cursor: puedeConvertir ? "pointer" : "not-allowed", color: "black" }}
            onClick={() => {
              if (puedeConvertir) setTabActivo("convertido");
              else message.warning("Debe completar todas las cuotas.");
            }}
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
        <InfoCircleOutlined style={{ fontSize: 12 }} />
        <Text style={{ fontSize: 9 }}>
          Para pasar a Convertido el cliente debe completar sus pagos
        </Text>
      </div>

      {/* ======= TAB COBRANZA ======= */}
      {tabActivo === "cobranza" ? (
        <div style={{ background: "#FFF", borderRadius: 12, padding: 16 }}>
          <Text strong>Cobranza</Text>

          <Space direction="vertical" style={{ marginTop: 10, width: "100%" }}>
            <Select
              value={numCuotas}
              options={[
                { value: "", label: "Seleccionar" },
                ...Array.from({ length: 12 }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: `${i + 1}`,
                })),
              ]}
              onChange={setNumCuotas}
              disabled={bloquearSelect}
            />

            <Button
              type="primary"
              disabled={bloquearSelect}
              onClick={async () => {
                if (!numCuotas) {
                  message.warning("Selecciona el número de cuotas");
                  return;
                }

                const nuevoPlan = await crearPlanCobranza(Number(numCuotas));
                if (!nuevoPlan) return;

                setIdPlan(nuevoPlan);

                const cuotasBack = await obtenerCuotasPlan(nuevoPlan);
                const normalizadas = mapearCuotas(cuotasBack);
                setCuotas(normalizadas);
                validarSiPuedeConvertir(normalizadas);

                const metInit: Record<number, number | ""> = {};
                normalizadas.forEach((f) => (metInit[f.id] = ""));
                setMetodoPorFila(metInit);

                setBloquearSelect(true);
              }}
            >
              Generar plan de cuotas
            </Button>
          </Space>

          <Table
            columns={columnsCobranza}
            dataSource={cuotas}
            pagination={false}
            size="small"
            rowKey="id"
            style={{ marginTop: 12 }}
            scroll={{ x: 650 }}
          />

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
        /* ======= TAB CONVERTIDO ======= */
        <div style={{ background: "#FFF", borderRadius: 12, padding: 16 }}>
          <Text strong>Convertido</Text>

          <Button
            type="primary"
            block
            style={{ marginTop: 12 }}
            onClick={registrarConvertido}
          >
            Confirmar estado convertido
          </Button>
        </div>
      )}
    </div>
  );
};

export default EstadoMatriculado;
