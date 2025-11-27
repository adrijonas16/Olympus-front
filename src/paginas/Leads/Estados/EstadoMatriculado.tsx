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
  abonado: number | null;
  pendiente: number;
  fechaPago: string;
  deshabilitado: boolean;
};

// ⭐⭐ BOTONES PREMIUM (MISMO ESTILO QUE EstadoPromesa)
const buttonStyle = (
  baseColor: string,
  hoverColor: string,
  disabled = false
): React.CSSProperties => ({
  background: disabled ? "#F0F0F0" : baseColor,
  color: "#0D0C11",
  border: "none",
  borderRadius: 6,
  padding: "6px 12px",
  fontSize: 13,
  fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: "0 1.5px 4px rgba(0,0,0,0.12)",
  transition: "all 0.14s ease",
  userSelect: "none",
  minWidth: 105,
  textAlign: "center",
  display: "inline-block",
  opacity: disabled ? 0.7 : 1,
});

const EstadoMatriculado: React.FC<{
  oportunidadId: number;
  onCreado: () => void;
  origenOcurrenciaId?: number | null;
  activo: boolean;
}> = ({ oportunidadId, onCreado, activo }) => {
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
  const validarSiPuedeConvertir = (lista: CuotaRow[]) => {
    const todasPagadas = lista.every((c) => c.pendiente <= 0);
    setPuedeConvertir(todasPagadas);
  };

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

  const mapearCuotas = (listaBackend: any[]): CuotaRow[] => {
    const hoy = dayjs().startOf("day");

    const base = listaBackend.map((c: any) => {
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
        deshabilitado: false,
      };
    });

    const ordenadas = [...base].sort((a, b) => a.numero - b.numero);

    let todasPreviasPagadas = true;

    return ordenadas.map((c) => {
      const vencida = hoy.isAfter(dayjs(c.fechaVencimiento));
      const pagada = c.pendiente <= 0;

      const deshabilitado = vencida || pagada || !todasPreviasPagadas;

      if (!pagada && !vencida && todasPreviasPagadas) {
        todasPreviasPagadas = false;
      }

      return { ...c, deshabilitado };
    });
  };

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

  useEffect(() => {
    const cargar = async () => {
      const plan = await obtenerPlanPorOportunidad(oportunidadId);
      if (plan) cargarPlanExistente(plan);
    };
    cargar();
  }, [oportunidadId]);

  const handleMontoChange = (id: number, value: string) => {
    if (!activo) return;

    const nuevoAbonado = value === "" ? null : Number(value);

    const actualizadas = cuotas.map((c) => {
      if (c.id !== id) return c;

      const abonadoReal = nuevoAbonado ?? 0;
      const pendienteReal = c.monto - abonadoReal;

      return {
        ...c,
        abonado: nuevoAbonado,
        pendiente: pendienteReal,
      };
    });

    const hoy = dayjs().startOf("day");
    const ordenadas = [...actualizadas].sort((a, b) => a.numero - b.numero);

    let todasPreviasPagadas = true;

    const conEstado = ordenadas.map((c) => {
      const vencida = hoy.isAfter(dayjs(c.fechaVencimiento));
      const pagada = c.pendiente <= 0;

      const deshabilitado = vencida || pagada || !todasPreviasPagadas;

      if (!pagada && !vencida && todasPreviasPagadas) {
        todasPreviasPagadas = false;
      }

      return { ...c, deshabilitado };
    });

    setCuotas(conEstado);
    validarSiPuedeConvertir(conEstado);
  };

  const handleMetodoChangeFila = (id: number, val: number | "") => {
    if (!activo) return;
    setMetodoPorFila((prev) => ({ ...prev, [id]: val }));
  };

  const handleFechaPagoChange = (id: number, date: any) => {
    if (!activo) return;
    if (!date) return;

    const nuevas = cuotas.map((c) =>
      c.id === id ? { ...c, fechaPago: date.format("YYYY-MM-DD") } : c
    );
    setCuotas(nuevas);
  };

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

  const handleConfirmarPagos = async () => {
    if (!activo) return;
    if (!idPlan) return;

    const filas = cuotas.filter(
      (c) => (c.abonado ?? 0) > 0 && !c.deshabilitado
    );

    if (filas.length === 0) {
      message.info("No hay cuotas abonadas");
      return;
    }

    for (const fila of filas) {
      if (fila.abonado === null) {
        message.warning(`Monto abonado vacío en cuota ${fila.numero}`);
        return;
      }
      if (fila.abonado < 0) {
        message.warning(`Monto abonado negativo en cuota ${fila.numero}`);
        return;
      }
    }

    for (const fila of filas) {
      if (!metodoPorFila[fila.id]) {
        message.warning(`Falta método de pago en cuota ${fila.numero}`);
        return;
      }
    }

    for (const f of filas) {
      await pagarCuotaAPI({
        idPlan,
        idCuota: f.id,
        monto: f.abonado as number,
        metodo: metodoPorFila[f.id] as number,
        fechaPago: dayjs(f.fechaPago).toISOString(),
      });
    }

    message.success("Pagos confirmados");

    const nuevas = await obtenerCuotasPlan(idPlan);
    const normalizadas = mapearCuotas(nuevas);
    setCuotas(normalizadas);
    validarSiPuedeConvertir(normalizadas);
  };

  const registrarConvertido = async () => {
    if (!activo) return;

    if (!puedeConvertir) {
      message.warning("Debe completar todas las cuotas.");
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
  // TABLA
  // ======================================================

  const columnsCobranza = [
    {
      title: "N°",
      dataIndex: "numero",
      width: 55,
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
          value={row.abonado ?? ""}
          disabled={!activo || row.deshabilitado}
          onChange={(e) => handleMontoChange(row.id, e.target.value)}
          style={{ fontSize: 10, height: 24 }}
        />
      ),
    },
    {
      title: "Pend.",
      width: 80,
      render: (_: any, row: CuotaRow) => `$ ${row.pendiente}`,
    },
    {
      title: "Método",
      width: 120,
      render: (_: any, row: CuotaRow) => (
        <Select
          value={metodoPorFila[row.id]}
          onChange={(v) => handleMetodoChangeFila(row.id, v)}
          disabled={!activo || row.deshabilitado}
          style={{ width: "100%" }}
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
      render: (_: any, row: CuotaRow) => (
        <DatePicker
          size="small"
          value={dayjs(row.fechaPago)}
          onChange={(d) => d && handleFechaPagoChange(row.id, d)}
          disabled={!activo || row.deshabilitado}
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
      {/* TABS PREMIUM */}
      <Row justify="space-between" align="middle">
        <Text style={{ fontSize: 12 }}>Ocurrencia:</Text>

        <Space>

          {/* BOTÓN — COBRANZA */}
          <div
            style={buttonStyle(
              tabActivo === "cobranza" ? "#B8F3B8" : "#D1D1D1",
              "#A7E8A7",
              !activo
            )}
            onMouseEnter={(e) => {
              if (tabActivo === "cobranza" || !activo) return;
              (e.currentTarget as HTMLElement).style.background = "#A7E8A7";
            }}
            onMouseLeave={(e) => {
              if (tabActivo === "cobranza" || !activo) return;
              (e.currentTarget as HTMLElement).style.background = "#D1D1D1";
            }}
            onClick={() => activo && setTabActivo("cobranza")}
          >
            Cobranza
          </div>

          {/* BOTÓN — CONVERTIDO */}
          <div
            style={buttonStyle(
              tabActivo === "convertido" ? "#B8F3B8" : "#D1D1D1",
              "#A7E8A7",
              !activo || !puedeConvertir
            )}
            onMouseEnter={(e) => {
              if (tabActivo === "convertido" || !activo || !puedeConvertir)
                return;
              (e.currentTarget as HTMLElement).style.background = "#A7E8A7";
            }}
            onMouseLeave={(e) => {
              if (tabActivo === "convertido" || !activo || !puedeConvertir)
                return;
              (e.currentTarget as HTMLElement).style.background = "#D1D1D1";
            }}
            onClick={() => activo && puedeConvertir && setTabActivo("convertido")}
          >
            Convertido
          </div>
        </Space>
      </Row>

      {/* INFO */}
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

      {/* COBRANZA */}
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
              onChange={(v) => activo && setNumCuotas(v)}
              disabled={!activo || bloquearSelect}
              style={{
                width: "100%",
              }}
            />

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                disabled={!activo || bloquearSelect}
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
            </div>
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
              disabled={!activo}
              onClick={handleConfirmarPagos}
              style={{ fontSize: 10 }}
            >
              Confirmar pago de cuotas
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ background: "#FFF", borderRadius: 12, padding: 16 }}>
          <Text strong>Convertido</Text>

          <Button
            type="primary"
            block
            disabled={!activo}
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
