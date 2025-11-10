import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card, Divider, Space, Typography, Row, Col } from "antd";
import { RightOutlined } from "@ant-design/icons";
import ModalHorarios from "./InformacionProductoModales/ModalHorarios";
import ModalInversion from "./InformacionProductoModales/ModalInversion";
import ModalDocentes from "./InformacionProductoModales/ModalDocentes";

const { Text, Title } = Typography;

type ModalKey = null | "horarios" | "inversion" | "docentes";

const InformacionProducto: React.FC = () => {
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const tabs = ["Producto actual", "Productos del área", "Otras áreas"];

  const detalles: Array<[string, string]> = [
    ["Nombre producto:", "Power BI"],
    ["Código Lanzamiento:", "IMBJDHSAJKLHDSAKJLDA"],
    ["Fecha de inicio:", "21-09-2025"],
    ["Fecha presentación:", "21-09-2025"],
  ];

  const closeModal = () => setOpenModal(null);

  const clickableBoxStyle: React.CSSProperties = useMemo(
    () => ({
      borderRadius: 6,
      border: "1px solid #DCDCDC",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 12px",
      background: "#fff",
      transition: "background 0.15s ease",
    }),
    []
  );

  const arrowStyle: React.CSSProperties = {
    color: "#A3A3A3",
    fontSize: 13,
    marginLeft: 8,
    flexShrink: 0,
  };

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const handleScroll = () => {};
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Title level={5} style={{ margin: "8px 0 0 0", color: "#252C35" }}>
        Información del Producto
      </Title>

      {/* === Contenedor plomo que envuelve tabs + contenido (fondo plomo + inset shadow) === */}
      <div
        style={{
          background: "#F0F0F0", // fondo plomo del bloque completo
          borderRadius: 10,
          padding: 10,
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15)", // sombra interna aplicada al bloque entero
        }}
      >
        {/* === Tabs: ya SIN fondo plomo en el contenedor de tabs (son transparentes dentro del plomo) === */}
        <Row
          gutter={6}
          style={{
            padding: 4,
            background: "transparent", // <- transparente para que no "repita" el plomo del tab bar
            borderRadius: 8,
            marginBottom: 6,
          }}
        >
          {tabs.map((tab, i) => (
            <Col flex={1} key={tab}>
              <Card
                style={{
                  background: i === 0 ? "#252C35" : "#FFFFFF",
                  textAlign: "center",
                  borderRadius: 8,
                  boxShadow: "1px 1px 2px rgba(0,0,0,0.12)",
                  border: i === 0 ? "none" : "1px solid #EAEAEA",
                }}
                bodyStyle={{ padding: "6px 8px" }}
              >
                <Text style={{ color: i === 0 ? "#FFFFFF" : "#0D0C11", fontSize: 13 }}>
                  {tab}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        {/* === Card blanca del contenido (sigue blanca con borde) === */}
        <Card
          ref={cardRef}
          style={{
            background: "#FFFFFF",
            borderRadius: 10,
            height: 420,
            overflowY: openModal ? "hidden" : "auto",
            position: "relative",
            border: "1px solid #DCDCDC", // borde blanco que pediste mantener
          }}
          bodyStyle={{ padding: 12 }}
        >
          {/* === Contenido principal === */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <Space direction="vertical" style={{ width: "100%" }} size={4}>
              {detalles.map(([label, value]) => (
                <div key={label}>
                  <Row justify="start" align="middle" gutter={6}>
                    <Col>
                      <Text type="secondary">{label}</Text>
                    </Col>
                    <Col>
                      <Text strong>{value}</Text>
                    </Col>
                  </Row>
                  <Divider style={{ margin: "4px 0" }} />
                </div>
              ))}

              {/* === Campos clickeables === */}
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Horarios:</Text>
                </Col>
                <Col flex={1}>
                  <div
                    onClick={() => setOpenModal("horarios")}
                    style={clickableBoxStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F7F7")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
                  >
                    <Text style={{ fontSize: 13 }}>
                      Lunes a viernes <br /> 7:00am → 9:00am <strong>PE</strong>
                    </Text>
                    <RightOutlined style={arrowStyle} />
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Inversión:</Text>
                </Col>
                <Col flex={1}>
                  <div
                    onClick={() => setOpenModal("inversion")}
                    style={clickableBoxStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F7F7")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
                  >
                    <div>
                      <Text strong>$100 </Text>
                      <Text>menos 25% de descuento</Text>
                      <br />
                      <Text strong>Total $75</Text>
                    </div>
                    <RightOutlined style={arrowStyle} />
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Estructura curricular:</Text>
                </Col>
                <Col flex={1}>
                  <Text style={{ fontSize: 13 }}>
                    “Ejercicios prácticos” <br /> “Vas a poder agilizar tus procesos con x cosas”
                  </Text>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Docentes:</Text>
                </Col>
                <Col flex={1}>
                  <div
                    onClick={() => setOpenModal("docentes")}
                    style={clickableBoxStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F7F7")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
                  >
                    <Text style={{ fontSize: 13 }}>
                      Docente de ejemplo 1 <br /> Docente de ejemplo 2 <br /> Docente de ejemplo 3
                    </Text>
                    <RightOutlined style={arrowStyle} />
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Certificado:</Text>
                </Col>
                <Col flex={1}>
                  <Text style={{ fontSize: 13 }}>
                    Certificado de ejemplo 1 <br /> Certificado de ejemplo 2
                  </Text>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Método de pago:</Text>
                </Col>
                <Col flex={1}>
                  <Text style={{ fontSize: 13 }}>Transferencia bancaria – Tarjeta – PayPal</Text>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Beneficios:</Text>
                </Col>
                <Col flex={1}>
                  <Text style={{ fontSize: 13 }}>
                    Acceso a grabaciones – Certificación – Asesorías personalizadas
                  </Text>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Datos importantes:</Text>
                </Col>
                <Col flex={1}>
                  <Text style={{ fontSize: 13 }}>
                    Las sesiones son en vivo; se comparten materiales y se graban.
                  </Text>
                </Col>
              </Row>
            </Space>
          </div>

          {/* === Overlay + modal === */}
          {openModal && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: cardRef.current ? `${cardRef.current.scrollHeight}px` : "100%",
                background: "rgba(0,0,0,0.45)",
                borderRadius: 10,
                zIndex: 5,
                pointerEvents: "auto",
              }}
              onClick={closeModal}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: (cardRef.current ? cardRef.current.scrollTop + cardRef.current.clientHeight / 2 : 210) - 10,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: 280,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                  padding: 12,
                }}
              >
                {openModal === "horarios" && <ModalHorarios onClose={closeModal} />}
                {openModal === "inversion" && <ModalInversion onClose={closeModal} />}
                {openModal === "docentes" && <ModalDocentes onClose={closeModal} />}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InformacionProducto;
