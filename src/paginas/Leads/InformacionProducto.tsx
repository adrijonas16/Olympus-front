import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card, Divider, Space, Typography, Row, Col, Spin } from "antd";
import { RightOutlined } from "@ant-design/icons";
import axios from "axios";
import { getCookie } from "../../utils/cookies";
import ModalHorarios from "./InformacionProductoModales/ModalHorarios";
import ModalInversion from "./InformacionProductoModales/ModalInversion";
import ModalDocentes from "./InformacionProductoModales/ModalDocentes";

const { Text, Title } = Typography;

type ModalKey = null | "horarios" | "inversion" | "docentes";

interface Horario {
  id: number;
  idProducto: number;
  productoNombre: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  detalle: string;
  orden: number;
  estado: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

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

interface Producto {
  id: number;
  nombre: string;
  codigoLanzamiento: string;
  fechaInicio: string;
  fechaPresentacion: string | null;
  datosImportantes: string;
  estado: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

interface Estructura {
  id: number;
  idProducto: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  idMigracion: number | null;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

interface Modulo {
  id: number;
  nombre: string;
  codigo: string | null;
  descripcion: string;
  duracionHoras: number;
  estado: boolean;
  idMigracion: number | null;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

interface EstructuraModulo {
  id: number;
  idEstructuraCurricular: number;
  idModulo: number;
  modulo: Modulo;
  orden: number;
  sesiones: number;
  duracionHoras: number;
  observaciones: string | null;
  idDocente: number | null;
  idPersonaDocente: number | null;
  docenteNombre: string | null;
}

interface Certificado {
  id: number;
  idProducto: number;
  idCertificado: number;
  nombreCertificado: string;
  estado: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

interface MetodoPago {
  id: number;
  idProducto: number;
  idMetodoPago: number;
  nombreMetodoPago: string;
  activo: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

interface Beneficio {
  id: number;
  idProducto: number;
  descripcion: string;
  orden: number | null;
  estado: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

interface DocentePorModulo {
  id: number;
  idEstructuraCurricular: number;
  idModulo: number;
  modulo: Modulo | null;
  orden: number | null;
  sesiones: number | null;
  duracionHoras: number | null;
  observaciones: string | null;
  idDocente: number;
  idPersonaDocente: number;
  docenteNombre: string;
}

interface ProductoDetalleResponse {
  producto: Producto;
  horarios: Horario[];
  inversiones: Inversion[];
  estructuras: Estructura[];
  estructuraModulos: EstructuraModulo[];
  productoCertificados: Certificado[];
  metodosPago: MetodoPago[];
  beneficios: Beneficio[];
  docentesPorModulo: DocentePorModulo[];
}

interface InformacionProductoProps {
  oportunidadId?: string;
}

const InformacionProducto: React.FC<InformacionProductoProps> = ({ oportunidadId }) => {
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const [productoData, setProductoData] = useState<Producto | null>(null);
  const [horariosData, setHorariosData] = useState<Horario[]>([]);
  const [inversionesData, setInversionesData] = useState<Inversion[]>([]);
  const [estructurasData, setEstructurasData] = useState<Estructura[]>([]);
  const [estructuraModulosData, setEstructuraModulosData] = useState<EstructuraModulo[]>([]);
  const [certificadosData, setCertificadosData] = useState<Certificado[]>([]);
  const [metodosPagoData, setMetodosPagoData] = useState<MetodoPago[]>([]);
  const [beneficiosData, setBeneficiosData] = useState<Beneficio[]>([]);
  const [docentesData, setDocentesData] = useState<DocentePorModulo[]>([]);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const tabs = ["Producto actual", "Productos del área", "Otras áreas"];

  // Función para formatear fechas de ISO a DD-MM-YYYY
  const formatearFecha = (fechaISO: string | null): string => {
    if (!fechaISO || fechaISO === "0001-01-01T00:00:00") return "-";
    try {
      const fecha = new Date(fechaISO);
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();
      return `${dia}-${mes}-${año}`;
    } catch {
      return "-";
    }
  };

  // Fetch de datos del producto
  useEffect(() => {
    if (!oportunidadId) {
      console.warn("⚠️ No hay ID de oportunidad disponible para InformacionProducto");
      return;
    }

    const token = getCookie("token");
    setLoading(true);

    const url = `/api/VTAModVentaProducto/DetallePorOportunidad/${oportunidadId}`;

    axios
      .get<ProductoDetalleResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProductoData(res.data.producto);
        setHorariosData(res.data.horarios || []);
        setInversionesData(res.data.inversiones || []);
        setEstructurasData(res.data.estructuras || []);
        setEstructuraModulosData(res.data.estructuraModulos || []);
        setCertificadosData(res.data.productoCertificados || []);
        setMetodosPagoData(res.data.metodosPago || []);
        setBeneficiosData(res.data.beneficios || []);
        setDocentesData(res.data.docentesPorModulo || []);
      })
      .catch((err) => {
        console.error("❌ Error al obtener datos del producto:", err.response?.data || err.message);
      })
      .finally(() => setLoading(false));
  }, [oportunidadId]);

  const detalles: Array<[string, string]> = [
    ["Nombre producto:", productoData?.nombre || "-"],
    ["Código Lanzamiento:", productoData?.codigoLanzamiento || "-"],
    ["Fecha de inicio:", formatearFecha(productoData?.fechaInicio || null)],
    ["Fecha presentación:", formatearFecha(productoData?.fechaPresentacion || null)],
  ];

  // Función para formatear hora de HH:mm:ss a HH:mm am/pm
  const formatearHora = (horaStr: string): string => {
    if (!horaStr) return "-";
    try {
      const [horas, minutos] = horaStr.split(":");
      const hora = parseInt(horas, 10);
      const ampm = hora >= 12 ? "pm" : "am";
      const hora12 = hora > 12 ? hora - 12 : hora === 0 ? 12 : hora;
      return `${hora12}:${minutos}${ampm}`;
    } catch {
      return horaStr;
    }
  };

  // Generar preview de horarios
  const previewHorarios = useMemo(() => {
    if (horariosData.length === 0) {
      return {
        dias: "Sin horarios",
        horas: ""
      };
    }

    // Formato de días
    let diasTexto = "";
    if (horariosData.length === 1) {
      diasTexto = horariosData[0].dia;
    } else if (horariosData.length > 1) {
      // Si son días consecutivos como Lunes-Viernes, mostrar rango
      const dias = horariosData.map(h => h.dia);
      const esConsecutivo = dias.includes("Lunes") && dias.includes("Martes") && dias.includes("Miércoles")
        && dias.includes("Jueves") && dias.includes("Viernes");

      if (esConsecutivo && horariosData.length === 5) {
        diasTexto = "Lunes a Viernes";
      } else {
        diasTexto = dias.join(", ");
      }
    }

    const horaInicio = formatearHora(horariosData[0].horaInicio);
    const horaFin = formatearHora(horariosData[0].horaFin);

    return {
      dias: diasTexto,
      horas: `${horaInicio} -> ${horaFin}`
    };
  }, [horariosData]);

  // Generar preview de inversión
  const previewInversion = useMemo(() => {
    if (inversionesData.length === 0) {
      return null;
    }

    const inversion = inversionesData[0];
    const tieneDescuento = inversion.descuentoPorcentaje > 0;

    return {
      costoTotal: inversion.costoTotal,
      porcentajeDescuento: inversion.descuentoPorcentaje,
      costoFinal: inversion.costoOfrecido,
      moneda: inversion.moneda,
      tieneDescuento
    };
  }, [inversionesData]);

  // Generar preview de docentes (lista única de docentes)
  const previewDocentes = useMemo(() => {
    if (docentesData.length === 0) {
      return [];
    }

    // Obtener docentes únicos por idDocente
    const docentesUnicos = docentesData.reduce((acc, docente) => {
      if (!acc.find(d => d.idDocente === docente.idDocente)) {
        acc.push(docente);
      }
      return acc;
    }, [] as DocentePorModulo[]);

    return docentesUnicos;
  }, [docentesData]);

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

      {/* === Contenedor plomo === */}
      <div
        style={{
          background: "#F0F0F0",
          borderRadius: 10,
          padding: 10,
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* === Tabs === */}
        <Row
          gutter={6}
          style={{
            padding: 4,
            background: "transparent",
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
                <Text
                  style={{
                    color: i === 0 ? "#FFFFFF" : "#0D0C11",
                    fontSize: 13,
                  }}
                >
                  {tab}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        {/* === Contenido blanco === */}
        <Card
          ref={cardRef}
          style={{
            background: "#FFFFFF",
            borderRadius: 10,
            height: 420,
            overflowY: openModal ? "hidden" : "auto",
            position: "relative",
            border: "1px solid #DCDCDC",
          }}
          bodyStyle={{ padding: 12 }}
        >
          {/* === Spinner de carga === */}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <>
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

              {/* === Horarios === */}
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Horarios:</Text>
                </Col>
                <Col flex={1}>
                  <div
                    onClick={() => setOpenModal("horarios")}
                    style={clickableBoxStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F7F7F7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#FFFFFF")
                    }
                  >
                    <div style={{ lineHeight: "1.5" }}>
                      {horariosData.length === 0 ? (
                        <Text style={{ fontSize: 13 }}>Sin horarios</Text>
                      ) : (
                        <>
                          <Text style={{ fontSize: 13, display: "block" }}>
                            {previewHorarios.dias}
                          </Text>
                          <Text style={{ fontSize: 13, display: "block" }}>
                            {previewHorarios.horas} PE
                          </Text>
                        </>
                      )}
                    </div>
                    <RightOutlined style={arrowStyle} />
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />

              {/* === Inversión === */}
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Inversión:</Text>
                </Col>
                <Col flex={1}>
                  <div
                    onClick={() => setOpenModal("inversion")}
                    style={clickableBoxStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F7F7F7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#FFFFFF")
                    }
                  >
                    <div style={{ lineHeight: "1.5" }}>
                      {!previewInversion ? (
                        <Text style={{ fontSize: 13 }}>Sin información de inversión</Text>
                      ) : (
                        <>
                          {previewInversion.tieneDescuento ? (
                            <>
                              <Text style={{ fontSize: 13 }}>
                                <Text strong style={{ fontSize: 13 }}>${previewInversion.costoTotal} </Text>
                                <Text style={{ fontSize: 13 }}>menos {previewInversion.porcentajeDescuento}% de descuento</Text>
                              </Text>
                              <br />
                              <Text strong style={{ fontSize: 13 }}>Total ${previewInversion.costoFinal}</Text>
                            </>
                          ) : (
                            <Text strong style={{ fontSize: 13 }}>Total ${previewInversion.costoTotal}</Text>
                          )}
                        </>
                      )}
                    </div>
                    <RightOutlined style={arrowStyle} />
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />

              {/* === Curricular === */}
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Estructura curricular:</Text>
                </Col>
                <Col flex={1}>
                  {estructurasData.length > 0 ? (
                    <div>
                      <Text style={{ fontSize: 13 }}>
                        {estructurasData[0].nombre}
                      </Text>
                      {estructuraModulosData.length > 0 && (
                        <div style={{ marginTop: 6 }}>
                          {estructuraModulosData.map((modulo, index) => (
                            <div key={modulo.id || index} style={{ marginBottom: 4 }}>
                              <Text style={{ fontSize: 12, color: "#595959" }}>
                                • {modulo.modulo.nombre}
                              </Text>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Text style={{ fontSize: 13 }}>Sin estructura curricular</Text>
                  )}
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />

              {/* === Docentes === */}
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Docentes:</Text>
                </Col>
                <Col flex={1}>
                  <div
                    onClick={() => setOpenModal("docentes")}
                    style={clickableBoxStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F7F7F7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#FFFFFF")
                    }
                  >
                    <div style={{ lineHeight: "1.5" }}>
                      {previewDocentes.length === 0 ? (
                        <Text style={{ fontSize: 13 }}>Sin docentes</Text>
                      ) : (
                        previewDocentes.map((docente, index) => (
                          <Text key={docente.idDocente} style={{ fontSize: 13, display: "block" }}>
                            {docente.docenteNombre}
                            {index < previewDocentes.length - 1 && <br />}
                          </Text>
                        ))
                      )}
                    </div>
                    <RightOutlined style={arrowStyle} />
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />

              {/* === Certificado === */}
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Certificado:</Text>
                </Col>
                <Col flex={1}>
                  {certificadosData.length > 0 ? (
                    <div>
                      {certificadosData.map((certificado, index) => (
                        <Text key={certificado.id} style={{ fontSize: 13, display: "block" }}>
                          {certificado.nombreCertificado}
                          {index < certificadosData.length - 1 && <br />}
                        </Text>
                      ))}
                    </div>
                  ) : (
                    <Text style={{ fontSize: 13 }}>Sin certificados</Text>
                  )}
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />

              {/* === Método Pago === */}
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Método de pago:</Text>
                </Col>
                <Col flex={1}>
                  {metodosPagoData.length > 0 ? (
                    <Text style={{ fontSize: 13 }}>
                      {metodosPagoData.map(mp => mp.nombreMetodoPago).join(" – ")}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 13 }}>Sin métodos de pago</Text>
                  )}
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />

              {/* === Beneficios === */}
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Beneficios:</Text>
                </Col>
                <Col flex={1}>
                  {beneficiosData.length > 0 ? (
                    <Text style={{ fontSize: 13 }}>
                      {beneficiosData.map(b => b.descripcion).join(" – ")}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 13 }}>Sin beneficios</Text>
                  )}
                </Col>
              </Row>

              <Divider style={{ margin: "4px 0" }} />

              {/* === Datos importantes === */}
              <Row align="top" gutter={6}>
                <Col>
                  <Text type="secondary">Datos importantes:</Text>
                </Col>
                <Col flex={1}>
                  <Text style={{ fontSize: 13 }}>
                    Sesiones en vivo; incluye materiales y grabaciones.
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
                    {openModal === "docentes" && <ModalDocentes onClose={closeModal} docentes={previewDocentes} />}
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InformacionProducto;
