import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Typography, Divider, Spin, Alert } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import EstadoRegistrado from "./Estados/EstadoRegistrado";
import EstadoCalificado from "./Estados/EstadoCalificado";
import EstadoPotencial from "./Estados/EstadoPotencial";
import EstadoPromesa from "./Estados/EstadoPromesa";
import EstadoNoCalificado from "./Estados/EstadoNoCalificado";
import EstadoMatriculado from "./Estados/EstadoMatriculado";

import { getCookie } from "../../utils/cookies";

const { Text } = Typography;

interface Props {
  idOportunidad: number;
}

export default function HistorialEstados({ idOportunidad }: Props) {
  const [data, setData] = useState<
    Array<{
      id: number;
      idEstado: number;
      fecha: string;
      estado: string;
      marcaciones: number;
      asesor: string;
    }>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [abiertoId, setAbiertoId] = useState<number | null>(null);

  const toggleRegistro = (id: number) => {
    setAbiertoId((prev) => (prev === id ? null : id));
  };

  const renderContenido = (idEstado: number) => {
    switch (idEstado) {
      case 1:
        return <EstadoRegistrado />;
      case 2:
        return <EstadoCalificado />;
      case 3:
        return <EstadoMatriculado />;
      case 4:
      case 8:
      case 10:
        return <EstadoPromesa />;
      case 5:
      case 6:
      case 9:
        return <EstadoNoCalificado />;
      case 7:
        return <EstadoPotencial />;

      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = getCookie("token") ?? "";

        const url = `http://localhost:7020/api/VTAModVentaOportunidad/HistorialEstado/PorOportunidad/1`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          throw new Error("401 Unauthorized - revisa tu token");
        }

        if (!res.ok) {
          throw new Error(`Error al obtener historial (${res.status})`);
        }

        const json = await res.json();
        const historialRaw = json.historialEstados ?? [];

        const historial = historialRaw.map((item: any) => {
          const fechaISO = item.fechaCreacion;
          const fechaFormateada = fechaISO
            ? new Date(fechaISO).toLocaleDateString("es-PE")
            : "—";

          const idEstado = item.estadoReferencia?.id ?? item.idEstado ?? 0;

          const estado = item.estadoReferencia?.nombre ?? "Desconocido";

          const marcaciones =
            (item.cantidadLlamadasContestadas ?? 0) +
            (item.cantidadLlamadasNoContestadas ?? 0);

          const asesor = item.asesor
            ? `${item.asesor.nombres ?? ""} ${
                item.asesor.apellidos ?? ""
              }`.trim()
            : item.usuarioCreacion ?? "—";

          return {
            id: item.id,
            idEstado,
            fecha: fechaFormateada,
            _fechaRaw: fechaISO,
            estado,
            marcaciones,
            asesor,
          };
        });

        // Ordenar por fecha desc
        historial.sort((a: any, b: any) => {
          const fa = a._fechaRaw ? new Date(a._fechaRaw).getTime() : 0;
          const fb = b._fechaRaw ? new Date(b._fechaRaw).getTime() : 0;
          return fb - fa;
        });

        setData(historial);
        if (historial.length > 0) setAbiertoId(historial[0].id);
      } catch (err: any) {
        setError(err?.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOportunidad]);

  const colores = {
    gris: "#D1D1D1",
    azul: "#9CBDFD",
    verde: "#B8F3B8",
    rojo: "#F7B1B1",
    amarillo: "#FFF6A3",
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "Registrado":
      case "Calificado":
      case "Potencial":
        return colores.azul;
      case "Promesa":
        return colores.amarillo;
      case "Matriculado":
        return colores.verde;
      case "No Calificado":
      case "Perdido":
        return colores.rojo;
      default:
        return colores.gris;
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <Alert
        type="error"
        message="No se pudo cargar el historial"
        description={error}
        showIcon
      />
    );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
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
        {["Id", "Fecha de creación", "Estado", "Marcaciones", "Asesor"].map(
          (col, i) => (
            <Text
              key={i}
              style={{
                color: "#FFFFFF",
                fontSize: 12,
                flex: 1,
                textAlign: "center",
              }}
            >
              {col}
            </Text>
          )
        )}
      </div>

      {data.length === 0 && (
        <Card>
          <Text>No hay historial para esta oportunidad.</Text>
        </Card>
      )}

      {data.map((item) => {
        const esAbierto = abiertoId === item.id;

        return (
          <Card
            key={item.id}
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              border: "1px solid #DCDCDC",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            bodyStyle={{ padding: 12 }}
            onClick={() => toggleRegistro(item.id)}
          >
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
                  {item.id}
                </div>
              </Col>

              <Col flex="1">
                <Text style={{ color: "#0D0C11", fontSize: 12 }}>
                  {item.fecha}
                </Text>
              </Col>

              <Col flex="1">
                <Tag
                  color={getColorEstado(item.estado)}
                  style={{
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#0D0C11",
                    padding: "2px 10px",
                  }}
                >
                  {item.estado}
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
                  <Text style={{ color: "#0D0C11", fontSize: 12 }}>
                    {item.marcaciones}
                  </Text>
                </div>
              </Col>

              <Col flex="1">
                <Text style={{ color: "#0D0C11", fontSize: 12 }}>
                  {item.asesor}
                </Text>
              </Col>

              <Col flex="24px">
                {esAbierto ? <UpOutlined /> : <DownOutlined />}
              </Col>
            </Row>
            {esAbierto &&
              (() => {
                const idUltimo = data.length > 0 ? data[0].id : null;
                const esUltimo = item.id === idUltimo;

                return (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={
                      esUltimo ? {} : { pointerEvents: "none", opacity: 0.6 }
                    }
                  >
                    <Divider style={{ margin: "8px 0" }} />
                    {renderContenido(item.idEstado)}
                  </div>
                );
              })()}
          </Card>
        );
      })}
    </div>
  );
}
