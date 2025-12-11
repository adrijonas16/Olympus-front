import { useState, useEffect, useMemo } from "react";
import {
  Input,
  Select,
  Button,
  Modal,
  Checkbox,
  Spin,
  message,
  Table,
  Tag,
  DatePicker,
  Card,
  Space,
  Form,
  TimePicker,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  CloseOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { type Lead } from "../../config/leadsTableItems";
import estilos from "./Asignacion.module.css";
import estilosModal from "./ReasignacionMasiva.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import type { ColumnsType } from "antd/es/table";
import dayjs, { type Dayjs } from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface OportunidadBackend {
  id: number;
  idPotencialCliente: number;
  personaNombre: string;
  idProducto: number;
  productoNombre: string;
  idAsesor: number;
  asesorNombre: string;
  personaCorreo: string;
  codigoLanzamiento: string;
  totalOportunidadesPersona: number;
  origen: string | null;
  idHistorialEstado: number;
  idEstado: number;
  nombreEstado: string;
  idHistorialInteraccion: number;
  fechaRecordatorio: string | null;
  personaPaisId: number;
  personaPaisNombre: string;
  estado: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

interface Asesor {
  idUsuario: number;
  idPersona: number;
  nombre: string;
  idRol: number;
}

export default function Asignacion() {
  const [selectedRows, setSelectedRows] = useState<Lead[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [filterOrigen, setFilterOrigen] = useState<string>("Todos");
  const [filterPais, setFilterPais] = useState<string>("Todos");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [asesorDestino, setAsesorDestino] = useState<number | null>(null);
  const [forzarReasignacion, setForzarReasignacion] = useState(true);
  const [oportunidades, setOportunidades] = useState<OportunidadBackend[]>([]);
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAsesores, setLoadingAsesores] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fecha y hora de reasignación
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);

  const token = Cookies.get("token");

  const handleSelectionChange = (selected: Lead[]) => setSelectedRows(selected);

  const handleReasignarMasivo = () => {
    if (selectedRows.length > 0) setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setAsesorDestino(null);
    setForzarReasignacion(true);
    setSelectedDate(null);
    setSelectedTime(null);
  };

const handleConfirmarAsignacion = async () => {
  if (!asesorDestino || selectedRows.length === 0 || !selectedDate || !selectedTime) {
    return;
  }

  const hayConAsesor = selectedRows.some(
    (r) => (r.asesor ?? "").trim() !== ""
  );

  if (hayConAsesor && !forzarReasignacion) {
    return;
  }

  try {
    setLoading(true);

    const asesor = asesores.find((a) => a.idUsuario === asesorDestino);
    if (!asesor) throw new Error("Asesor no encontrado");

    // Fecha de recordatorio con hora formateada
    const fechaRecordatorioISO = selectedDate
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .second(0)
      .toISOString();

    const horaRecordatorio = selectedTime.format("HH:mm");

    for (const row of selectedRows) {
      
      const payloadInteraccion = {
        id: 0,
        idOportunidad: row.id,
        idTipo: 10,
        detalle: "Recordatorio inicial de creación de la oportunidad, generado automáticamente",
        celular: "",
        fechaRecordatorio: fechaRecordatorioISO,
        estado: true,
        fechaCreacion: new Date().toISOString(),
        usuarioCreacion: "usuarioActual",
        fechaModificacion: new Date().toISOString(),
        usuarioModificacion: "usuarioActual",
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:7020"}/api/VTAModVentaHistorialInteraccion/Insertar`,
        payloadInteraccion,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    const payload = {
      IdOportunidades: selectedRows.map((r) => r.id),
      IdAsesor: asesor.idPersona,
      UsuarioModificacion: "usuarioActual",
      FechaRecordatorio: fechaRecordatorioISO,
      HoraRecordatorio: horaRecordatorio,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || "http://localhost:7020"}/api/VTAModVentaOportunidad/AsignarAsesor`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.codigo === "SIN ERROR") {
      message.success("Asesor asignado correctamente");
      setSelectedRows([]);
      handleCloseModal();
      obtenerOportunidades();
    } else {
      message.error(response.data.mensaje || "Error al asignar asesor");
    }
  } catch (err: any) {
    message.error(
      err?.response?.data?.mensaje || err?.message || "Error al asignar asesor"
    );
  } finally {
    setLoading(false);
  }
};


  const handleLimpiarFiltros = () => {
    setSearchText("");
    setFilterEstado("Todos");
    setFilterOrigen("Todos");
    setFilterPais("Todos");
    setDateRange(null);
  };

  const handleAgregarLeads = () => {
    console.log("Agregar nuevos leads");
  };

  const obtenerOportunidades = async () => {
    try {
      setLoading(true);
      if (!token) throw new Error("No se encontró el token de autenticación");

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:7020"
        }/api/VTAModVentaOportunidad/ObtenerTodasConRecordatorio`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      if (data && data.oportunidad && Array.isArray(data.oportunidad)) {
        const oportunidadesOrdenadas = [...data.oportunidad].sort(
          (a: OportunidadBackend, b: OportunidadBackend) => {
            const fechaA = new Date(a.fechaCreacion).getTime();
            const fechaB = new Date(b.fechaCreacion).getTime();

            if (isNaN(fechaA) && isNaN(fechaB)) {
              return a.id - b.id;
            }
            if (isNaN(fechaA)) return 1;
            if (isNaN(fechaB)) return -1;

            const diferenciaFecha = fechaA - fechaB;

            if (Math.abs(diferenciaFecha) < 1000) {
              return a.id - b.id;
            }

            return diferenciaFecha;
          }
        );
        setOportunidades(oportunidadesOrdenadas);
        console.log("✅ Oportunidades obtenidas:", oportunidadesOrdenadas.length);
      } else {
        setOportunidades([]);
        console.warn("⚠️ No se encontraron oportunidades en la respuesta");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.mensaje ||
        err?.message ||
        "Error al cargar las oportunidades";
      setError(errorMessage);
      message.error(errorMessage);
      setOportunidades([]);
    } finally {
      setLoading(false);
    }
  };

  const obtenerAsesores = async () => {
    try {
      setLoadingAsesores(true);
      if (!token) throw new Error("No se encontró el token de autenticación");

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:7020"
        }/api/CFGModUsuarios/ObtenerUsuariosPorRol/1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      if (data?.usuarios && Array.isArray(data.usuarios)) {
        const listaAsesores = data.usuarios.map((u: any) => ({
          idUsuario: u.id,
          idPersona: u.idPersona,
          nombre: u.nombre,
          idRol: u.idRol,
        }));
        setAsesores(listaAsesores);
      } else {
        setAsesores([]);
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.mensaje ||
        err?.message ||
        "Error al cargar asesores";
      setError(errorMessage);
      message.error(errorMessage);
      setAsesores([]);
    } finally {
      setLoadingAsesores(false);
    }
  };

  useEffect(() => {
    obtenerOportunidades();
    obtenerAsesores();
  }, []);

  const leadsMapeados = useMemo(
    () =>
      oportunidades.map((o) => ({
        id: o.id,
        codigoLanzamiento: o.codigoLanzamiento || "-",
        nombre: o.personaNombre || "-",
        asesor: o.asesorNombre,
        estado: o.nombreEstado || "-",
        origen: o.origen || "-",
        pais: o.personaPaisNombre || "-",
        fechaFormulario: new Date(o.fechaCreacion).toLocaleString("es-ES"),
      })),
    [oportunidades]
  );

  const estadosUnicos = useMemo(() => {
    const estados = new Set<string>();
    oportunidades.forEach((op) => {
      if (op.nombreEstado) {
        estados.add(op.nombreEstado);
      }
    });
    return Array.from(estados).sort();
  }, [oportunidades]);

  const origenesUnicos = useMemo(() => {
    const origenes = new Set<string>();
    leadsMapeados.forEach((lead) => {
      if (lead.origen && lead.origen !== "-") {
        origenes.add(lead.origen);
      }
    });
    return Array.from(origenes).sort();
  }, [leadsMapeados]);

  const paisesUnicos = useMemo(() => {
    const paises = new Set<string>();
    leadsMapeados.forEach((lead) => {
      if (lead.pais && lead.pais !== "-") {
        paises.add(lead.pais);
      }
    });
    return Array.from(paises).sort();
  }, [leadsMapeados]);

  const leadsFiltrados = useMemo(() => {
    let filtrados = [...leadsMapeados];

    if (searchText.trim()) {
      const busqueda = searchText.toLowerCase();
      filtrados = filtrados.filter(
        (l) =>
          l.nombre.toLowerCase().includes(busqueda) ||
          l.origen.toLowerCase().includes(busqueda) ||
          l.codigoLanzamiento.toLowerCase().includes(busqueda) ||
          l.id.toString().includes(busqueda)
      );
    }

    if (filterEstado !== "Todos") {
      filtrados = filtrados.filter((lead) => lead.estado === filterEstado);
    }

    if (filterOrigen !== "Todos") {
      filtrados = filtrados.filter((lead) => lead.origen === filterOrigen);
    }

    if (filterPais !== "Todos") {
      filtrados = filtrados.filter((lead) => lead.pais === filterPais);
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const fechaInicio = dateRange[0].startOf("day");
      const fechaFin = dateRange[1].endOf("day");
      filtrados = filtrados.filter((lead) => {
        const fechaCreacion = dayjs(lead.fechaFormulario);
        return (
          (fechaCreacion.isAfter(fechaInicio) ||
            fechaCreacion.isSame(fechaInicio, "day")) &&
          (fechaCreacion.isBefore(fechaFin) ||
            fechaCreacion.isSame(fechaFin, "day"))
        );
      });
    }

    return filtrados;
  }, [leadsMapeados, searchText, filterEstado, filterOrigen, filterPais, dateRange]);

  const columns: ColumnsType<Lead> = useMemo(
    () => [
      {
        title: "IdLead",
        dataIndex: "id",
        key: "id",
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: "Código Lanzamiento",
        dataIndex: "codigoLanzamiento",
        key: "codigoLanzamiento",
        sorter: (a, b) =>
          (a.codigoLanzamiento || "").localeCompare(b.codigoLanzamiento || ""),
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
        sorter: (a, b) => (a.nombre || "").localeCompare(b.nombre || ""),
      },
      {
        title: "Asesor",
        dataIndex: "asesor",
        key: "asesor",
        sorter: (a, b) => (a.asesor || "").localeCompare(b.asesor || ""),
      },
      {
        title: "Estado",
        dataIndex: "estado",
        key: "estado",
        sorter: (a, b) => (a.estado || "").localeCompare(b.estado || ""),
        render: (estado: string) => {
          let color = "green";

          if (estado === "Calificado") {
            color = "blue";
          } else if (estado === "Registrado") {
            color = "blue";
          } else if (estado === "Promesa") {
            color = "gold";
          } else if (estado === "No calificado" || estado === "Perdido") {
            color = "red";
          } else if (estado === "Matriculado" || estado === "Cliente") {
            color = "green";
          } else if (estado === "Pendiente") {
            color = "orange";
          }

          return (
            <Tag color={color} style={{ borderRadius: "12px", padding: "2px 12px" }}>
              {estado}
            </Tag>
          );
        },
      },
      {
        title: "Origen",
        dataIndex: "origen",
        key: "origen",
        sorter: (a, b) => (a.origen || "").localeCompare(b.origen || ""),
      },
      {
        title: "País",
        dataIndex: "pais",
        key: "pais",
        sorter: (a, b) => (a.pais || "").localeCompare(b.pais || ""),
      },
      {
        title: "Fecha Formulario",
        dataIndex: "fechaFormulario",
        key: "fechaFormulario",
        sorter: (a, b) =>
          new Date(a.fechaFormulario).getTime() -
          new Date(b.fechaFormulario).getTime(),
        render: (fechaCreacion: string) => (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <CalendarOutlined style={{ color: "#8c8c8c", marginTop: "2px" }} />
            <div>
              <div style={{ color: "#000000", fontSize: "14px" }}>
                {new Date(fechaCreacion).toLocaleDateString()}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#8c8c8c",
                  fontSize: "13px",
                }}
              >
                <ClockCircleOutlined style={{ fontSize: "12px" }} />
                {new Date(fechaCreacion).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys: selectedRows.map((row) => row.id),
      onChange: (
        _selectedRowKeys: React.Key[],
        selectedRowsData: Lead[]
      ) => {
        setSelectedRows(selectedRowsData);
      },
      getCheckboxProps: (record: Lead) => ({
        name: record.id.toString(),
      }),
    }),
    [selectedRows]
  );

  const hayOportunidadesConAsesor = selectedRows.some(
    (l) => (l.asesor ?? "").trim() !== ""
  );

  const botonDeshabilitado =
    !asesorDestino ||
    !selectedDate ||
    !selectedTime ||
    (!forzarReasignacion && hayOportunidadesConAsesor);

  return (
    <div className={estilos.container}>
      <div className={estilos.contentWrapper}>
        <div className={estilos.header}>
          <h1 className={estilos.title}>Oportunidades</h1>
        </div>

        {/* Barra de búsqueda y botones - Arriba */}
        <div className={estilos.toolbar}>
          <div className={estilos.searchBar}>
            <Input
              placeholder="Buscar por nombre, telefono, email u origen."
              prefix={<SearchOutlined />}
              className={estilos.searchInput}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className={estilos.actions}>
            <Button
              type="primary"
              className={estilos.btnReasignar}
              disabled={selectedRows.length === 0}
              onClick={handleReasignarMasivo}
            >
              Reasignar masivo
            </Button>
            <Button className={estilos.btnLimpiar} onClick={handleLimpiarFiltros}>
              Limpiar filtros
            </Button>
            <Button
              type="default"
              className={estilos.btnAgregar}
              icon={<PlusOutlined />}
              onClick={handleAgregarLeads}
            >
              Agregar Nuevos Leads
            </Button>
          </div>
        </div>

        {/* Filtros - Abajo */}
        <div className={estilos.filtersRow}>
          <Select
            value={filterEstado}
            onChange={setFilterEstado}
            className={estilos.filterSelect}
            placeholder="Seleccionar estado"
          >
            <Option value="Todos">Todos los estados</Option>
            {estadosUnicos.map((estado) => (
              <Option key={estado} value={estado}>
                {estado}
              </Option>
            ))}
          </Select>
          <Select
            value={filterOrigen}
            onChange={setFilterOrigen}
            className={estilos.filterSelect}
            placeholder="Seleccionar origen"
          >
            <Option value="Todos">Todos los orígenes</Option>
            {origenesUnicos.map((origen) => (
              <Option key={origen} value={origen}>
                {origen}
              </Option>
            ))}
          </Select>
          <Select
            value={filterPais}
            onChange={setFilterPais}
            className={estilos.filterSelect}
            placeholder="Seleccionar país"
          >
            <Option value="Todos">Todos los países</Option>
            {paisesUnicos.map((pais) => (
              <Option key={pais} value={pais}>
                {pais}
              </Option>
            ))}
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) =>
              setDateRange(dates as [Dayjs | null, Dayjs | null] | null)
            }
            format="DD/MM/YYYY"
            placeholder={["Fecha inicio", "Fecha fin"]}
            className={estilos.dateRangePicker}
          />
        </div>

        <div className={estilos.tableWrapper}>
          {loading ? (
            <Spin size="large" />
          ) : error ? (
            <div style={{ color: "#ff4d4f" }}>{error}</div>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={leadsFiltrados}
                rowKey="id"
                rowSelection={rowSelection}
                pagination={{ pageSize: 10 }}
              />
              {selectedRows.length > 0 && (
                <div className={estilos.selectionInfo}>
                  {selectedRows.length} Oportunidades seleccionadas
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        centered
        closeIcon={<CloseOutlined />}
        className={estilosModal.modal}
      >
        <div className={estilosModal.modalContent}>
          <h2 className={estilosModal.title}>Reasignación Masiva</h2>

          {/* === ALCANCE === */}
          <div className={estilosModal.section}>
            <label className={estilosModal.label}>Alcance:</label>
            <div className={estilosModal.leadsCount}>
              {selectedRows.length}{" "}
              {selectedRows.length === 1
                ? "oportunidad seleccionada"
                : "oportunidades seleccionadas"}
            </div>
          </div>

          {/* === SELECT ASESOR === */}
          <div className={estilosModal.section}>
            <label className={estilosModal.label}>Asesor destino</label>

            {loadingAsesores ? (
              <Spin />
            ) : (
              <Select
                value={asesorDestino}
                onChange={setAsesorDestino}
                placeholder="Selecciona un asesor"
                className={estilosModal.select}
                size="large"
              >
                {asesores.map((a) => (
                  <Option key={a.idUsuario} value={a.idUsuario}>
                    {a.nombre}
                  </Option>
                ))}
              </Select>
            )}
          </div>

          {/* === FECHA Y HORA === */}
          <Form layout="vertical" style={{ marginTop: 10 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <Form.Item
                label={
                  <span>
                    Fecha<span style={{ color: "#ff4d4f" }}>*</span>
                  </span>
                }
                required
                style={{ flex: 1 }}
              >
                <DatePicker
                  value={selectedDate}
                  onChange={(d) => setSelectedDate(d)}
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Hora<span style={{ color: "#ff4d4f" }}>*</span>
                  </span>
                }
                required
                style={{ flex: 1 }}
              >
                <TimePicker
                  value={selectedTime}
                  onChange={(t) => setSelectedTime(t)}
                  format="HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          </Form>

          {/* === PROGRAMADO PARA === */}
          <div
            style={{
              marginTop: 6,
              background: "#f0f2f5",
              padding: "10px 14px",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {selectedDate && selectedTime ? (
              <>
                <b>Programado para:</b>{" "}
                {selectedDate.format("dddd").charAt(0).toUpperCase() +
                  selectedDate.format("dddd").slice(1)}
                , {selectedDate.format("DD [de] MMMM [de] YYYY")} a las{" "}
                {selectedTime.format("HH:mm")} horas
              </>
            ) : (
              <span style={{ color: "#888" }}>
                Programado para: seleccione fecha y hora
              </span>
            )}
          </div>

          {/* === CHECKBOX === */}
          <div className={estilosModal.section}>
            <Checkbox
              checked={forzarReasignacion}
              onChange={(e) => setForzarReasignacion(e.target.checked)}
            >
              Forzar reasignación incluso si lead ya tiene asesor asignado
            </Checkbox>
          </div>

          {/* === TARJETAS DE OPORTUNIDADES === */}
          {selectedRows.length > 0 && (
            <div
              style={{
                maxHeight: 240,
                overflowY: "auto",
                marginTop: 12,
                paddingRight: 6,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {selectedRows.map((op) => (
                <Card
                  key={op.id}
                  hoverable
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                  }}
                  bodyStyle={{ padding: 12 }}
                >
                  <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {op.nombre}
                    </div>
                    <div style={{ color: "#555" }}>
                      <b>Código:</b> {op.codigoLanzamiento}
                    </div>
                    <div>
                      <b>Origen:</b> {op.origen} {" | "} <b>País:</b> {op.pais}
                    </div>
                    <div>
                      <b>Asesor actual:</b>{" "}
                      {op.asesor?.trim() ? op.asesor : "Sin asignar"}
                    </div>

                    <Tag
                      color="blue"
                      style={{
                        borderRadius: 6,
                        padding: "2px 10px",
                        width: "fit-content",
                      }}
                    >
                      {op.estado}
                    </Tag>

                    <div style={{ fontSize: 13, color: "#666" }}>
                      <b>Fecha:</b>{" "}
                      {new Date(op.fechaFormulario).toLocaleDateString("es-ES")}{" "}
                      {new Date(op.fechaFormulario).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </Space>
                </Card>
              ))}
            </div>
          )}

          {/* === ERROR INLINE === */}
          {!forzarReasignacion && hayOportunidadesConAsesor && (
            <div
              style={{
                marginTop: 16,
                color: "#c62828",
                background: "#ffebee",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #ffcdd2",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Algunas oportunidades ya tienen asesor asignado. Activa la opción
              “Forzar reasignación”.
            </div>
          )}

          {/* === BOTÓN CONFIRMAR === */}
          <Button
            type="primary"
            block
            size="large"
            style={{ marginTop: 16 }}
            disabled={botonDeshabilitado}
            onClick={handleConfirmarAsignacion}
          >
            Confirmar reasignación
          </Button>
        </div>
      </Modal>
    </div>
  );
}
