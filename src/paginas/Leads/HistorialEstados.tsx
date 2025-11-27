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
  IdEstado?: number | null;
  IdOcurrencia?: number | null;
  Observaciones?: string;
  CantidadLlamadasContestadas?: number;
  CantidadLlamadasNoContestadas?: number;
  FechaCreacion?: string;
  UsuarioCreacion?: string;
  EstadoNombre?: string;
};

type Props = {
  oportunidadId: number;
};

const HistorialEstados: React.FC<Props> = ({ oportunidadId }) => {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [abiertoId, setAbiertoId] = useState<number | null>(null);
  const [latestId, setLatestId] = useState<number | null>(null);

  const fetchHistorial = async () => {
    if (!oportunidadId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(
        `/api/VTAModVentaOportunidad/HistorialEstado/PorOportunidad/${oportunidadId}`
      );
      const json = res.data;

      const rawList: any[] =
        json?.historialEstados ??
        json?.historialEstado ??
        json?.HistorialEstado ??
        json?.Historiales ??
        json?.data ??
        json?.historial ??
        [];

      const list = rawList.map((h: any) => ({
        Id: h.Id ?? h.id,
        IdEstado: h.IdEstado ?? h.idEstado,
        IdOcurrencia: h.IdOcurrencia ?? h.idOcurrencia,
        Observaciones: h.Observaciones ?? "",
        FechaCreacion: h.FechaCreacion ?? h.fechaCreacion ?? h.fecha ?? null,
        UsuarioCreacion: h.UsuarioCreacion ?? h.usuarioCreacion ?? "",
        EstadoNombre:
          h.EstadoReferencia?.Nombre ??
          h.estadoReferencia?.nombre ??
          h.EstadoNombre ??
          h.estadoNombre ??
          "",
        CantidadLlamadasContestadas:
          h.CantidadLlamadasContestadas ?? h.cantidadLlamadasContestadas ?? 0,
        CantidadLlamadasNoContestadas:
          h.CantidadLlamadasNoContestadas ?? h.cantidadLlamadasNoContestadas ?? 0,
      }));

      if (list.length > 0) {
        setHistorial(list);

        // ⭐ SOLO POR ID DESC — el ID mayor es el último editable
        const sortedById = [...list].sort(
          (a, b) => Number(b.Id) - Number(a.Id)
        );

        const lastId = Number(sortedById[0].Id);
        setLatestId(lastId);
        setAbiertoId(lastId);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, [oportunidadId]);

  const toggleRegistro = (id: number) => {
    setAbiertoId((prev) => (prev === id ? null : id));
  };

  // ⭐ Render contend with "activo"
  const renderContenido = (
    estadoNombre: string,
    item: HistorialItem,
    isLatest: boolean
  ) => {
    const props = {
      oportunidadId,
      origenOcurrenciaId: item.IdOcurrencia,
      onCreado: fetchHistorial,
      activo: isLatest, // ⭐ AQUÍ SE CONTROLA TODO
    };

    switch (estadoNombre.toLowerCase()) {
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
        return <EstadoNoCalificado {...props} />;
      default:
        return null;
    }
  };

  const colores = {
    gris: "#D1D1D1",
    azul: "#9CBDFD",
    verde: "#B8F3B8",
    rojo: "#F7B1B1",
  };

  const getColorEstado = (estadoNombre?: string, estadoId?: number) => {
    const e = (estadoNombre ?? estadoMap[estadoId ?? 0] ?? "").toLowerCase();

    switch (e) {
      case "registrado":
      case "calificado":
      case "potencial":
      case "promesa":
        return colores.azul;
      case "matriculado":
        return colores.verde;
      case "no calificado":
        return colores.rojo;
      default:
        return colores.gris;
    }
  };

  if (loading) return <Spin />;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {error && (
        <Alert type="error" message="Error al cargar historial" description={error} />
      )}

      {/* ENCABEZADO */}
      <div
        style={{
          background: "#1D2128",
          borderRadius: 8,
          padding: "6px 8px",
          display: "flex",
          textAlign: "center",
        }}
      >
        <div style={{ width: 52, color: "#fff", fontSize: 12 }}>Id</div>
        <div style={{ flex: 1, color: "#fff", fontSize: 12 }}>
          Fecha de creación
        </div>
        <div style={{ flex: 1, color: "#fff", fontSize: 12 }}>Estado</div>
        <div style={{ flex: 1, color: "#fff", fontSize: 12 }}>Marcaciones</div>
        <div style={{ flex: 1, color: "#fff", fontSize: 12 }}>Asesor</div>
        <div style={{ width: 24 }}></div>
      </div>

      {/* REGISTROS */}
      {historial.map((h) => {
        const id = Number(h.Id ?? h.id);
        const isLatest = id === latestId;
        const estado =
          h.EstadoNombre ?? estadoMap[h.IdEstado ?? 0] ?? "—";
        const fecha = h.FechaCreacion
          ? new Date(h.FechaCreacion).toLocaleDateString()
          : "—";
        const abierto = abiertoId === id;
        const marc = h.CantidadLlamadasNoContestadas ?? 0;

        return (
          <Card
            key={id}
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              border: "1px solid #DCDCDC",
            }}
            bodyStyle={{ padding: 12 }}
          >
            <Row
              align="middle"
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => toggleRegistro(id)}
            >
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
                <Text>{fecha}</Text>
              </Col>

              <Col flex="1">
                <Tag
                  color={getColorEstado(estado, h.IdEstado ?? 0)}
                  style={{
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#0D0C11",
                    padding: "2px 10px",
                  }}
                >
                  {estado}
                </Tag>
              </Col>

              <Col flex="1">
                <div
                  style={{
                    background: "#FFCDCD",
                    borderRadius: 4,
                    width: 40,
                    margin: "auto",
                  }}
                >
                  <Text>{marc}</Text>
                </div>
              </Col>

              <Col flex="1">
                <Text>{h.UsuarioCreacion}</Text>
              </Col>

              <Col flex="24px">
                {abierto ? <UpOutlined /> : <DownOutlined />}
              </Col>
            </Row>

            {/* CONTENIDO EXPANDIDO */}
            {abierto && (
              <>
                <Divider style={{ margin: "8px 0" }} />
                {renderContenido(estado, h, isLatest)}
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default HistorialEstados;
