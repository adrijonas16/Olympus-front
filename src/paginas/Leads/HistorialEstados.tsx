import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Typography, Divider, Spin, Alert } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import EstadoRegistrado from "./Estados/EstadoRegistrado";
import EstadoCalificado from "./Estados/EstadoCalificado";
import EstadoPotencial from "./Estados/EstadoPotencial";
import EstadoPromesa from "./Estados/EstadoPromesa";
import EstadoNoCalificado from "./Estados/EstadoNoCalificado";
import EstadoMatriculado from "./Estados/EstadoMatriculado";
import api from "../../servicios/api";

const { Text } = Typography;

const fallbackData = [
  { id: 241, fecha: "2025-09-26", estadoId: 8, estadoNombre: "No Calificado", marcaciones: 3, asesor: "Fernando Ibarra" },
  { id: 240, fecha: "2025-09-26", estadoId: 3, estadoNombre: "Matriculado", marcaciones: 3, asesor: "Fernando Ibarra" },
  { id: 239, fecha: "2025-09-24", estadoId: 6, estadoNombre: "Promesa", marcaciones: 2, asesor: "Fernando Ibarra" },
  { id: 238, fecha: "2025-09-22", estadoId: 5, estadoNombre: "Potencial", marcaciones: 2, asesor: "Ana Martínez" },
  { id: 237, fecha: "2025-09-20", estadoId: 4, estadoNombre: "Calificado", marcaciones: 1, asesor: "Ana Martínez" },
  { id: 236, fecha: "2025-09-15", estadoId: 1, estadoNombre: "Registrado", marcaciones: 0, asesor: "Ana Martínez" },
];

// IdEstado Nombre
const estadoMap: Record<number, string> = {
  1: "Registrado",
  2: "No Calificado",
  3: "Matriculado",
  4: "Calificado",
  5: "Potencial",
  6: "Promesa",
  7: "Perdido",
};

type HistorialItem = {
  Id?: number;
  id?: number;
  IdOportunidad?: number;
  IdAsesor?: number | null;
  IdEstado?: number | null;
  IdOcurrencia?: number | null;
  Observaciones?: string;
  CantidadLlamadasContestadas?: number;
  CantidadLlamadasNoContestadas?: number;
  Estado?: boolean;
  FechaCreacion?: string;
  UsuarioCreacion?: string;
  FechaModificacion?: string;
  UsuarioModificacion?: string;
  estadoNombre?: string;
  EstadoNombre?: string;
  estado?: string;
};

type Props = {
  oportunidadId: number;
  baseUrl?: string;
};

const HistorialEstados: React.FC<Props> = ({ oportunidadId, baseUrl }) => {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [abiertoId, setAbiertoId] = useState<number | null>(null);
  const [latestId, setLatestId] = useState<number | null>(null);

  const fetchHistorial = async () => {
    if (oportunidadId === undefined || oportunidadId === null) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/VTAModVentaOportunidad/HistorialEstado/PorOportunidad/${oportunidadId}`);
      const json = res.data;

    const rawList: any[] =
      json?.historialEstados ??
      json?.historialEstado ??
      json?.HistorialEstado ??
      json?.Historiales ??
      json?.data ??
      json?.historial ??
      [];

    const list = (rawList || []).map((h: any) => ({
      Id: h.Id ?? h.id,
      IdOportunidad: h.IdOportunidad ?? h.idOportunidad,
      IdAsesor: h.IdAsesor ?? h.idAsesor,
      IdEstado: h.IdEstado ?? h.idEstado,
      IdOcurrencia: h.IdOcurrencia ?? h.idOcurrencia,
      Observaciones: h.Observaciones ?? h.observaciones ?? "",
      CantidadLlamadasContestadas:
        h.CantidadLlamadasContestadas ?? h.cantidadLlamadasContestadas ?? 0,
      CantidadLlamadasNoContestadas:
        h.CantidadLlamadasNoContestadas ?? h.cantidadLlamadasNoContestadas ?? 0,
      Estado: h.Estado ?? h.estado ?? true,
      FechaCreacion:
        h.FechaCreacion ?? h.fechaCreacion ?? h.fecha ?? null,
      UsuarioCreacion:
        h.UsuarioCreacion ?? h.usuarioCreacion ?? h.usuario ?? "",
      FechaModificacion:
        h.FechaModificacion ?? h.fechaModificacion ?? h.fecha_modificacion ?? null,
      UsuarioModificacion:
        h.UsuarioModificacion ?? h.usuarioModificacion ?? h.usuario_modificacion ?? "",
      // Si el backend retorna info anidada (EstadoReferencia), intentar tomar nombre ahí
      EstadoReferencia:
        h.EstadoReferencia ?? h.estadoReferencia ?? h.estadoReferencia ?? null,
      EstadoNombre:
        // prioridad: EstadoReferencia.Nombre -> estadoNombre -> null
        (h.EstadoReferencia?.Nombre ?? h.estadoReferencia?.nombre ?? h.EstadoNombre ?? h.estadoNombre) ?? undefined,
    }));

    console.log("parsed list:", list);

    if (Array.isArray(list) && list.length > 0) {
      setHistorial(list);

      // Elegir el más reciente por FechaCreacion (por si el backend no viene ordenado)
    const withDates = list
      .map(l => ({ id: l.Id ?? l.Id, fecha: l.FechaCreacion ? new Date(l.FechaCreacion) : new Date(0) }))
      .filter(x => !!x.id);

      const newest = withDates.sort((a, b) => b.fecha.getTime() - a.fecha.getTime())[0];
      const newestId = newest ? newest.id : (list[0].Id ?? list[0].Id);
      setLatestId(newestId ?? null);
      setAbiertoId(newestId ?? (list[0].Id ?? list[0].Id) ?? null);
    } else {
      setHistorial(fallbackData);
      setLatestId(fallbackData[0].id);
      setAbiertoId(fallbackData[0].id);
    }
  } catch (ex: any) {
    console.error("Error fetchHistorial:", ex);
    setError(ex?.message ?? "Error al obtener historial");
    setHistorial(fallbackData);
    setAbiertoId(fallbackData[0].id);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oportunidadId]);

  const toggleRegistro = (id: number) => setAbiertoId(prev => (prev === id ? null : id));

  const onCreado = () => {
    fetchHistorial();
  };

  const renderContenido = (estadoNombre: string | undefined, item: HistorialItem, activo: boolean) => {
    const props = { oportunidadId, onCreado ,     origenOcurrenciaId: item.IdOcurrencia, activo};
    switch ((estadoNombre ?? "").toLowerCase()) {
      case "registrado":
        return <EstadoRegistrado {...props} />;
      case "calificado":
        return <EstadoCalificado {...props} />;
      case "potencial":
        return <EstadoPotencial {...props} />;
      case "promesa":
        return <EstadoPromesa {...props} />;
      case "matriculado":
        return <EstadoMatriculado {...props} />;
      case "no calificado":
      case "no_calificado":
      case "no calificado":
        return <EstadoNoCalificado {...props} />;
      default:
        return null;
    }
  };

  // Paleta de colores
  const colores = {
    gris: "#D1D1D1",
    azul: "#9CBDFD",
    verde: "#B8F3B8",
    rojo: "#F7B1B1",
    amarillo: "#FFF6A3",
  };

  const getColorEstado = (estadoNombre?: string, estadoId?: number) => {
    const e = (estadoNombre ?? (estadoId ? estadoMap[estadoId] : "")).toString();
    switch (e.toLowerCase()) {
      case "registrado":
      case "calificado":
      case "potencial":
        return colores.azul;
      case "promesa":
        return colores.azul;
      case "matriculado":
        return colores.verde;
      case "no calificado":
      case "no_calificado":
        return colores.rojo;
      default:
        return colores.gris;
    }
  };

  if (loading) return <Spin />;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      {error && <Alert type="error" message="Error" description={error} />}
      {/* Encabezado */}
      <div
        style={{
          background: "#1D2128",
          borderRadius: 8,
          padding: "6px 8px",
          display: "flex",
          justifyContent: "space-between",
          textAlign: "center",
        }}
      >
        {["Id", "Fecha de creación", "Estado", "Marcaciones", "Asesor"].map((col, i) => (
          <Text key={i} style={{ color: "#FFFFFF", fontSize: 12, flex: 1, textAlign: "center" }}>
            {col}
          </Text>
        ))}
      </div>

      {/* Registros */}
      {historial.map((h) => {
        const id = (h.Id ?? h.id) as number;
        const isLatest = id === latestId;
        const fechaRaw = h.FechaCreacion ?? h.FechaCreacion ?? h.FechaCreacion;
        const fecha = fechaRaw ? new Date(fechaRaw).toLocaleDateString() : "—";
        const estadoId = (h.IdEstado ?? h.IdEstado) ?? undefined;
        const estadoNombre = (h.EstadoNombre ?? h.estadoNombre ?? (estadoId ? estadoMap[estadoId] : undefined) ?? "").toString();
        const marcaciones = h.CantidadLlamadasContestadas ?? 0;
        const asesor = h.UsuarioCreacion ?? "—";
        const esAbierto = abiertoId === id;

        return (
          <Card
            key={id}
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              border: "1px solid #DCDCDC",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            bodyStyle={{ padding: 12 }}
            onClick={() => toggleRegistro(id)}
          >
            {/* Fila principal */}
            <Row align="middle" style={{ textAlign: "center" }}>
              <Col flex="52px">
                <div
                  style={{
                    background: "#0056F1",
                    borderRadius: 6,
                    color: "#fff",
                    padding: "2px 0",
                  }}
                >
                  {id}
                </div>
              </Col>
              <Col flex="1">
                <Text style={{ color: "#0D0C11", fontSize: 12 }}>{fecha}</Text>
              </Col>
              <Col flex="1">
                <Tag
                  color={getColorEstado(estadoNombre, estadoId)}
                  style={{
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#0D0C11",
                    padding: "2px 10px",
                  }}
                >
                  {estadoNombre || `Estado ${estadoId ?? ""}`}
                </Tag>
              </Col>
              <Col flex="1">
                <div
                  style={{
                    background: "#FFCDCD",
                    borderRadius: 4,
                    width: 40,
                    margin: "auto",
                    textAlign: "center",
                  }}
                >
                  <Text style={{ color: "#0D0C11", fontSize: 12 }}>{marcaciones}</Text>
                </div>
              </Col>
              <Col flex="1">
                <Text style={{ color: "#0D0C11", fontSize: 12 }}>{asesor}</Text>
              </Col>
              <Col flex="24px">{esAbierto ? <UpOutlined /> : <DownOutlined />}</Col>
            </Row>

            {/* Contenido expandido */}
            {esAbierto && (
              <>
                <Divider style={{ margin: "8px 0" }} />
                {renderContenido(estadoNombre, h,isLatest)}
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default HistorialEstados;
