import React, { useState } from "react";
import { Card, Row, Col, Tag, Typography, Divider } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

// Importa los estados
import EstadoRegistrado from "./Estados/EstadoRegistrado";
import EstadoCalificado from "./Estados/EstadoCalificado";
import EstadoPotencial from "./Estados/EstadoPotencial";
import EstadoPromesa from "./Estados/EstadoPromesa";
import EstadoNoCalificado from "./Estados/EstadoNoCalificado";
import EstadoMatriculado from "./Estados/EstadoMatriculado";

const { Text } = Typography;

const data = [
  { id: 241, fecha: "26-09-2025", estado: "No Calificado", marcaciones: 3, asesor: "Fernando Ibarra" },
  { id: 240, fecha: "26-09-2025", estado: "Matriculado", marcaciones: 3, asesor: "Fernando Ibarra" },
  { id: 239, fecha: "24-09-2025", estado: "Promesa", marcaciones: 2, asesor: "Fernando Ibarra" },
  { id: 238, fecha: "22-09-2025", estado: "Potencial", marcaciones: 2, asesor: "Ana Martínez" },
  { id: 237, fecha: "20-09-2025", estado: "Calificado", marcaciones: 1, asesor: "Ana Martínez" },
  { id: 236, fecha: "15-09-2025", estado: "Registrado", marcaciones: 0, asesor: "Ana Martínez" },
];

const HistorialEstados = () => {
  const [abiertoId, setAbiertoId] = useState<number>(data[0].id);
  const toggleRegistro = (id: number) => setAbiertoId(id);

  const renderContenido = (estado: string) => {
    switch (estado) {
      case "Registrado":
        return <EstadoRegistrado />;
      case "Calificado":
        return <EstadoCalificado />;
      case "Potencial":
        return <EstadoPotencial />;
      case "Promesa":
        return <EstadoPromesa />;
      case "Matriculado":
        return <EstadoMatriculado />;
      case "No Calificado":
        return <EstadoNoCalificado />;
      default:
        return null;
    }
  };

  // 🎨 Paleta de colores corregida
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
        return colores.rojo;
      default:
        return colores.gris;
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
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
                  {item.id}
                </div>
              </Col>
              <Col flex="1">
                <Text style={{ color: "#0D0C11", fontSize: 12 }}>{item.fecha}</Text>
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
                  <Text style={{ color: "#0D0C11", fontSize: 12 }}>{item.marcaciones}</Text>
                </div>
              </Col>
              <Col flex="1">
                <Text style={{ color: "#0D0C11", fontSize: 12 }}>{item.asesor}</Text>
              </Col>
              <Col flex="24px">{esAbierto ? <UpOutlined /> : <DownOutlined />}</Col>
            </Row>

            {/* Contenido expandido */}
            {esAbierto && (
              <>
                <Divider style={{ margin: "8px 0" }} />
                {renderContenido(item.estado)}
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default HistorialEstados;
