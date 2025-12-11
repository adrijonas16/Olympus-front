import { useState, useEffect, useMemo } from "react";
import { Input, Select, Button, Modal, Checkbox, Spin, message, Table, Tag, DatePicker, Card } from "antd";
import { SearchOutlined, PlusOutlined, CloseOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
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
  personaPaisId: number,
	personaPaisNombre: string,
  estado: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

interface Asesor {
  idUsuario: number;
  idPersona: number; // <-- agregamos idPersona
  nombre: string;
  idRol: number;
}
interface SkippedSource {
  id: number;
  formName: string;
  motivo: string;
  createdDate?: string | null;
}

export default function Asignacion() {
  const [selectedRows, setSelectedRows] = useState<Lead[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [filterOrigen, setFilterOrigen] = useState<string>("Todos");
  const [filterPais, setFilterPais] = useState<string>("Todos");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [asesorDestino, setAsesorDestino] = useState<number | null>(null);
  const [forzarReasignacion, setForzarReasignacion] = useState(true);
  const [oportunidades, setOportunidades] = useState<OportunidadBackend[]>([]);
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAsesores, setLoadingAsesores] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importRange, setImportRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{
    filasProcesadas: number;
    filasSaltadas: number;
    filasEnRango: number;
    skippedSources: SkippedSource[];
    mensaje: string;
  } | null>(null  );

  const token = Cookies.get("token");

  const handleReasignarMasivo = () => {
    if (selectedRows.length > 0) setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setAsesorDestino(null);
    setForzarReasignacion(true);
  };

const handleConfirmarAsignacion = async () => {
  if (!asesorDestino || selectedRows.length === 0) return;

  // 🔥 VALIDACIÓN NUEVA
  const oportunidadesConAsesor = selectedRows.filter(r => r.asesor && r.asesor.trim() !== "");

  if (oportunidadesConAsesor.length > 0 && !forzarReasignacion) {
    message.error("Hay oportunidades que ya tienen asesor asignado. Debes activar 'Forzar reasignación' para continuar.");
    return;
  }

  try {
    setLoading(true);

    const asesor = asesores.find(a => a.idUsuario === asesorDestino);
    if (!asesor) throw new Error("Asesor no encontrado");

    const payload = {
      IdOportunidades: selectedRows.map(r => r.id),
      IdAsesor: asesor.idPersona,
      UsuarioModificacion: "usuarioActual"
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
    message.error(err?.response?.data?.mensaje || err?.message || "Error al asignar asesor");
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
  setImportModalOpen(true);
  setImportRange(null);
  setImportResult(null);
};

const closeImportModal = () => {
  setImportModalOpen(false);
  setImportRange(null);
  setImportResult(null);
};

const ejecutarImportacion = async () => {
  try {
    setImportLoading(true);
    setImportResult(null);

    if (!token) throw new Error("No se encontró el token de autenticación");

    const fechaInicioIso = importRange && importRange[0] ? importRange[0].toISOString() : null;
    const fechaFinIso = importRange && importRange[1] ? importRange[1].toISOString() : null;

    const payload = {
      FechaInicio: fechaInicioIso,
      FechaFin: fechaFinIso,
    };

    const url = `${import.meta.env.VITE_API_URL || "http://localhost:7020"}/api/VTAModVentaOportunidad/ImportarProcesadoLinkedin`;

    const response = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data ?? {};

    const filasProcesadas = data?.filasProcesadas ?? data?.FilasProcesadas ?? 0;
    const filasSaltadas = data?.filasSaltadas ?? data?.FilasSaltadas ?? 0;
    const filasEnRango = data?.filasEnRango ?? data?.FilasEnRango ?? 0;
    const skipped = Array.isArray(data?.skippedSources ?? data?.SkippedSources) ? (data?.skippedSources ?? data?.SkippedSources) : [];

    const skippedMapped: SkippedSource[] = skipped.map((s: any) => ({
      id: s.id ?? s.Id ?? 0,
      formName: s.formName ?? s.FormName ?? "",
      motivo: s.motivo ?? s.Motivo ?? "",
      createdDate: s.createdDate ?? s.CreatedDate ?? null,
    }));

    setImportResult({
      filasProcesadas,
      filasSaltadas,
      filasEnRango,
      skippedSources: skippedMapped,
      mensaje: data?.respuesta?.mensaje ?? data?.Respuesta?.Mensaje ?? data?.mensaje ?? "",
    });

    if ((data?.respuesta?.codigo ?? data?.Respuesta?.Codigo ?? "1") === "0") {
      message.success("Importación finalizada correctamente.");
      obtenerOportunidades(); // refresca la tabla principal
    } else {
      console.log(data?.respuesta?.mensaje ?? data?.Respuesta?.Mensaje ?? data?.mensaje ?? "Importación finalizada con advertencias.");
    }
  } catch (err: any) {
    console.error("Error al importar:", err);
    message.error(err?.response?.data?.mensaje || err?.message || "Error al ejecutar importación");
  } finally {
    setImportLoading(false);
  }
};

  const obtenerOportunidades = async () => {
    try {
      setLoading(true);
      if (!token) throw new Error("No se encontró el token de autenticación");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:7020"}/api/VTAModVentaOportunidad/ObtenerTodasConRecordatorio`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      if (data && data.oportunidad && Array.isArray(data.oportunidad)) {
        // Ordenar las oportunidades por fecha de creación ascendente y luego por ID
        const oportunidadesOrdenadas = [...data.oportunidad].sort((a: OportunidadBackend, b: OportunidadBackend) => {
          const fechaA = new Date(a.fechaCreacion).getTime();
          const fechaB = new Date(b.fechaCreacion).getTime();
          
          // Si alguna fecha es inválida (NaN), ponerla al final
          if (isNaN(fechaA) && isNaN(fechaB)) {
            return a.id - b.id; // Ordenar por ID si ambas fechas son inválidas
          }
          if (isNaN(fechaA)) return 1; // A va al final
          if (isNaN(fechaB)) return -1; // B va al final
          
          // Primero ordenar por fecha
          const diferenciaFecha = fechaA - fechaB;
          
          // Si las fechas son iguales o muy similares (menos de 1 segundo), ordenar por ID
          if (Math.abs(diferenciaFecha) < 1000) {
            return a.id - b.id;
          }
          
          return diferenciaFecha; // Ascendente: más antiguo primero
        });
        setOportunidades(oportunidadesOrdenadas);
        console.log("✅ Oportunidades obtenidas:", oportunidadesOrdenadas.length);
      } else {
        setOportunidades([]);
        console.warn("⚠️ No se encontraron oportunidades en la respuesta");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.mensaje || err?.message || "Error al cargar las oportunidades";
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
        `${import.meta.env.VITE_API_URL || "http://localhost:7020"}/api/CFGModUsuarios/ObtenerUsuariosPorRol/1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      if (data?.usuarios && Array.isArray(data.usuarios)) {
        const listaAsesores = data.usuarios.map((u: any) => ({
          idUsuario: u.id,
          idPersona: u.idPersona, // <-- capturamos idPersona
          nombre: u.nombre,
          idRol: u.idRol
        }));
        setAsesores(listaAsesores);
      } else {
        setAsesores([]);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.mensaje || err?.message || "Error al cargar asesores";
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

  const leadsMapeados = useMemo(() => oportunidades.map(o => ({
    id: o.id,
    codigoLanzamiento: o.codigoLanzamiento || '-',
    nombre: o.personaNombre || '-',
    asesor: o.asesorNombre,
    estado: o.nombreEstado || '-',
    origen: o.origen || '-',
    pais: o.personaPaisNombre || '-',
    fechaFormulario: new Date(o.fechaCreacion).toLocaleString('es-ES')
  })), [oportunidades]);

  const estadosUnicos = useMemo(() => {
    const estados = new Set<string>();
    oportunidades.forEach(op => {
      if (op.nombreEstado) {
        estados.add(op.nombreEstado);
      }
    });
    return Array.from(estados).sort();
  }, [oportunidades]);

  const origenesUnicos = useMemo(() => {
    const origenes = new Set<string>();
    leadsMapeados.forEach(lead => {
      if (lead.origen && lead.origen !== '-') {
        origenes.add(lead.origen);
      }
    });
    return Array.from(origenes).sort();
  }, [leadsMapeados]);

  const paisesUnicos = useMemo(() => {
    const paises = new Set<string>();
    leadsMapeados.forEach(lead => {
      if (lead.pais && lead.pais !== '-') {
        paises.add(lead.pais);
      }
    });
    return Array.from(paises).sort();
  }, [leadsMapeados]);

  const leadsFiltrados = useMemo(() => {
    let filtrados = [...leadsMapeados];

    if (searchText.trim()) {
      const busqueda = searchText.toLowerCase();
      filtrados = filtrados.filter(l =>
        l.nombre.toLowerCase().includes(busqueda) ||
        l.origen.toLowerCase().includes(busqueda) ||
        l.codigoLanzamiento.toLowerCase().includes(busqueda) ||
        l.id.toString().includes(busqueda)
      );
    }

    if (filterEstado !== "Todos") {
      filtrados = filtrados.filter(lead => lead.estado === filterEstado);
    }

    if (filterOrigen !== "Todos") {
      filtrados = filtrados.filter(lead => lead.origen === filterOrigen);
    }

    if (filterPais !== "Todos") {
      filtrados = filtrados.filter(lead => lead.pais === filterPais);
    }

    // Filtro por rango de fechas
    if (dateRange && dateRange[0] && dateRange[1]) {
      const fechaInicio = dateRange[0].startOf('day');
      const fechaFin = dateRange[1].endOf('day');
      filtrados = filtrados.filter(lead => {
        const fechaCreacion = dayjs(lead.fechaFormulario);
        return (fechaCreacion.isAfter(fechaInicio) || fechaCreacion.isSame(fechaInicio, 'day')) &&
               (fechaCreacion.isBefore(fechaFin) || fechaCreacion.isSame(fechaFin, 'day'));
      });
    }

    return filtrados;
  }, [leadsMapeados, searchText, filterEstado, filterOrigen, filterPais, dateRange]);

  const columns: ColumnsType<Lead> = useMemo(() => [
    {
      title: 'IdLead',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Código Lanzamiento',
      dataIndex: 'codigoLanzamiento',
      key: 'codigoLanzamiento',
      sorter: (a, b) => (a.codigoLanzamiento || '').localeCompare(b.codigoLanzamiento || ''),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => (a.nombre || '').localeCompare(b.nombre || ''),
    },
    {
      title: 'Asesor',
      dataIndex: 'asesor',
      key: 'asesor',
      sorter: (a, b) => (a.asesor || '').localeCompare(b.asesor || ''),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      sorter: (a, b) => (a.estado || '').localeCompare(b.estado || ''),
      render: (estado: string) => {
        let color = 'green';

        if (estado === 'Calificado') {
          color = 'blue';
        } else if (estado === 'Registrado') {
          color = 'blue';
        } else if (estado === 'Promesa') {
          color = 'gold';
        } else if (estado === 'No calificado' || estado === 'Perdido') {
          color = 'red';
        } else if (estado === 'Matriculado' || estado === 'Cliente') {
          color = 'green';
        } else if (estado === 'Pendiente') {
          color = 'orange';
        }

        return (
          <Tag color={color} style={{ borderRadius: '12px', padding: '2px 12px' }}>
            {estado}
          </Tag>
        );
      }
    },
    {
      title: 'Origen',
      dataIndex: 'origen',
      key: 'origen',
      sorter: (a, b) => (a.origen || '').localeCompare(b.origen || ''),
    },
    {
      title: 'País',
      dataIndex: 'pais',
      key: 'pais',
      sorter: (a, b) => (a.pais || '').localeCompare(b.pais || ''),
    },
    {
      title: 'Fecha Formulario',
      dataIndex: 'fechaFormulario',
      key: 'fechaFormulario',
      sorter: (a, b) => new Date(a.fechaFormulario).getTime() - new Date(b.fechaFormulario).getTime(),
      render: (fechaCreacion: string) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <CalendarOutlined style={{ color: '#8c8c8c', marginTop: '2px' }} />
          <div>
            <div style={{ color: '#000000', fontSize: '14px' }}>{new Date(fechaCreacion).toLocaleDateString()}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8c8c8c', fontSize: '13px' }}>
              <ClockCircleOutlined style={{ fontSize: '12px' }} />
              {new Date(fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      )
    }
  ], []);

  const skippedColumns: ColumnsType<SkippedSource> = [
  { title: "Id", dataIndex: "id", key: "id", width: 80 },
  { title: "FormName", dataIndex: "formName", key: "formName" },
  { title: "Motivo", dataIndex: "motivo", key: "motivo" },
  {
    title: "CreatedDate",
    dataIndex: "createdDate",
    key: "createdDate",
    render: (d: string | undefined | null) => (d ? new Date(d).toLocaleString() : "-"),
  },
];


  const rowSelection = useMemo(() => ({
    selectedRowKeys: selectedRows.map(row => row.id),
    onChange: (_selectedRowKeys: React.Key[], selectedRowsData: Lead[]) => {
      setSelectedRows(selectedRowsData);
    },
    getCheckboxProps: (record: Lead) => ({
      name: record.id.toString(),
    }),
  }), [selectedRows]);

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
            <Button
              className={estilos.btnLimpiar}
              onClick={handleLimpiarFiltros}
            >
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
            {estadosUnicos.map(estado => (
              <Option key={estado} value={estado}>{estado}</Option>
            ))}
          </Select>
          <Select
            value={filterOrigen}
            onChange={setFilterOrigen}
            className={estilos.filterSelect}
            placeholder="Seleccionar origen"
          >
            <Option value="Todos">Todos los orígenes</Option>
            {origenesUnicos.map(origen => (
              <Option key={origen} value={origen}>{origen}</Option>
            ))}
          </Select>
          <Select
            value={filterPais}
            onChange={setFilterPais}
            className={estilos.filterSelect}
            placeholder="Seleccionar país"
          >
            <Option value="Todos">Todos los países</Option>
            {paisesUnicos.map(pais => (
              <Option key={pais} value={pais}>{pais}</Option>
            ))}
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
            format="DD/MM/YYYY"
            placeholder={['Fecha inicio', 'Fecha fin']}
            className={estilos.dateRangePicker}
          />
        </div>

        <div className={estilos.tableWrapper}>
          {loading ? <Spin size="large" /> : error ? <div style={{ color: "#ff4d4f" }}>{error}</div> :
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
          }
        </div>
      </div>

      <Modal open={modalOpen} onCancel={handleCloseModal} footer={null} width={600} centered closeIcon={<CloseOutlined />} className={estilosModal.modal}>
        <div className={estilosModal.modalContent}>
          <h2 className={estilosModal.title}>Reasignacion Masiva</h2>

          <div className={estilosModal.section}>
            <label className={estilosModal.label}>Alcance:</label>
            <div className={estilosModal.leadsCount}>{selectedRows.length} {selectedRows.length === 1 ? "lead seleccionado" : "leads seleccionados"}</div>
          </div>

          <div className={estilosModal.section}>
            <label className={estilosModal.label}>Asesor destino</label>
            {loadingAsesores ? <Spin /> :
              <Select
                value={asesorDestino}
                onChange={setAsesorDestino}
                placeholder="Selecciona un asesor"
                className={estilosModal.select}
                size="large"
              >
                {asesores.map(a => (
                  <Option key={a.idUsuario} value={a.idUsuario}>{a.nombre}</Option>
                ))}
              </Select>
            }
          </div>

          <div className={estilosModal.section}>
            <label className={estilosModal.label}>Opciones:</label>
            <Checkbox checked={forzarReasignacion} onChange={e => setForzarReasignacion(e.target.checked)}>Forzar reasignacion incluso si lead esta en contacto</Checkbox>
          </div>

          <Button type="primary" block size="large" disabled={!asesorDestino} onClick={handleConfirmarAsignacion}>
            Confirmar asignacion
          </Button>
        </div>
      </Modal>

      {/* Importar Procesado Linkedin*/}
      <Modal
        open={importModalOpen}
        onCancel={closeImportModal}
        footer={null}
        width={600}
        centered
        closeIcon={<CloseOutlined />}
        className={estilosModal.modal}
      >
        <div className={estilosModal.modalContent}>
          <h2 className={estilosModal.title}>Importar Procesado desde LinkedIn</h2>

          {/* Rango de fecha */}
          <div className={estilosModal.section}>
            <label className={estilosModal.label}>Rango de fecha (fecha de subida al CRM):</label>
            <RangePicker
              showTime
              value={importRange}
              onChange={(dates) => setImportRange(dates as [Dayjs | null, Dayjs | null] | null)}
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
              placeholder={["Fecha inicio", "Fecha fin"]}
              className={estilosModal.input}
            />
          </div>

          <div className={estilosModal.section}>
            <Button
              onClick={() => { setImportRange(null); setImportResult(null); }}
              size="large"
            >
              Limpiar
            </Button>
          </div>

          {/* Estado / spinner y resultados */}
          {importLoading && (
            <div style={{ textAlign: "center", padding: 16 }}>
              <Spin /> Ejecutando importación...
            </div>
          )}

          {importResult && (
            <>
              <Card style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div><strong>Filas procesadas:</strong> {importResult.filasProcesadas}</div>
                  <div><strong>Filas saltadas:</strong> {importResult.filasSaltadas}</div>
                  <div><strong>Filas en rango:</strong> {importResult.filasEnRango}</div>
                  {importResult.mensaje && <div style={{ width: "100%", marginTop: 8 }}><strong>Mensaje:</strong> {importResult.mensaje}</div>}
                </div>
              </Card>
            </>
          )}

          {/* Botón principal: ocupa todo el ancho y centrado como en el otro modal */}
          <Button
            type="primary"
            block
            size="large"
            onClick={ejecutarImportacion}
            loading={importLoading}
            disabled={importLoading}
            style={{ marginBottom: 8 }}
          >
            Ejecutar importación
          </Button>
        </div>
      </Modal>


    </div>
  );

  
}
