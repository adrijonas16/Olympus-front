import { useState, useEffect, useMemo } from "react";
import { Input, Select, Button, Modal, Checkbox, Spin, message, Table, Tag, DatePicker } from "antd";
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

export default function Asignacion() {
  const [selectedRows, setSelectedRows] = useState<Lead[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [filterOrigen, setFilterOrigen] = useState<string>("Todos");
  const [filterPais, setFilterPais] = useState<string>("Todos");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [poolDestino, setPoolDestino] = useState<string>("");
  const [forzarReasignacion, setForzarReasignacion] = useState(true);
  const [agregarComentario, setAgregarComentario] = useState(true);
  const [oportunidades, setOportunidades] = useState<OportunidadBackend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const handleReasignarMasivo = () => {
    if (selectedRows.length > 0) {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPoolDestino("");
    setForzarReasignacion(true);
    setAgregarComentario(true);
  };

  const handleConfirmarAsignacion = () => {
    if (!poolDestino) {
      return;
    }
    console.log("Confirmar asignación:", {
      leads: selectedRows,
      poolDestino,
      forzarReasignacion,
      agregarComentario
    });
    handleCloseModal();
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

  const mapearOportunidadALead = (oportunidad: OportunidadBackend): Lead => {
    return {
      id: oportunidad.id,
      codigoLanzamiento: oportunidad.codigoLanzamiento || '-',
      nombre: oportunidad.personaNombre || '-',
      asesor: 'Sin asesor',
      estado: oportunidad.nombreEstado || '-',
      origen: oportunidad.origen || '-',
      pais: oportunidad.personaPaisNombre || '-', 
      fechaFormulario: oportunidad.fechaCreacion, // Guardar la fecha ISO original
      correo: oportunidad.personaCorreo || undefined
    };
  };


  const obtenerOportunidades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = Cookies.get("token");
      if (!token) {
        console.warn("⚠️ No se encontró el token en las cookies");
        setError("No se encontró el token de autenticación");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:7020"}/api/VTAModVentaOportunidad/ObtenerTodasConRecordatorio`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      console.error('Error al obtener oportunidades:', err);
      const errorMessage = err?.response?.data?.mensaje || err?.response?.data?.message || err?.message || 'Error al cargar las oportunidades';
      setError(errorMessage);
      message.error(errorMessage);
      setOportunidades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerOportunidades();
  }, []);

  const leadsMapeados = useMemo(() => {
    // Las oportunidades ya vienen ordenadas, solo mapeamos
    return oportunidades.map(mapearOportunidadALead);
  }, [oportunidades]);

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
      const busqueda = searchText.toLowerCase().trim();
      filtrados = filtrados.filter(lead => {
        const nombreMatch = lead.nombre.toLowerCase().includes(busqueda);
        const origenMatch = lead.origen.toLowerCase().includes(busqueda);
        const codigoMatch = lead.codigoLanzamiento.toLowerCase().includes(busqueda);
        const idMatch = lead.id.toString().includes(busqueda);
        return nombreMatch || origenMatch || codigoMatch || idMatch;
      });
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
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#ff4d4f' }}>
              {error}
            </div>
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
        closeIcon={<CloseOutlined style={{ fontSize: 16 }} />}
        className={estilosModal.modal}
        maskClosable={true}
      >
        <div className={estilosModal.modalContent}>
          <h2 className={estilosModal.title}>Reasignacion Masiva</h2>

          <div className={estilosModal.section}>
            <label className={estilosModal.label}>Alcance:</label>
            <div className={estilosModal.leadsCount}>
              {selectedRows.length} {selectedRows.length === 1 ? "lead seleccionado" : "leads seleccionados"}
            </div>
          </div>

          <div className={estilosModal.section}>
            <label className={estilosModal.label}>Pool destino</label>
            <Select
              value={poolDestino}
              onChange={setPoolDestino}
              placeholder="Selecciona un pool"
              className={estilosModal.select}
              size="large"
            >
              <Option value="pool1">Pool 1</Option>
              <Option value="pool2">Pool 2</Option>
              <Option value="pool3">Pool 3</Option>
            </Select>
          </div>

          <div className={estilosModal.section}>
            <label className={estilosModal.label}>Opciones:</label>
            <div className={estilosModal.checkboxes}>
              <Checkbox
                checked={forzarReasignacion}
                onChange={(e) => setForzarReasignacion(e.target.checked)}
                className={estilosModal.checkbox}
              >
                Forzar reasignacion incluso si lead esta en contacto
              </Checkbox>
              <Checkbox
                checked={agregarComentario}
                onChange={(e) => setAgregarComentario(e.target.checked)}
                className={estilosModal.checkbox}
              >
                Agregar comentario: "Reasignado por camapaña X"
              </Checkbox>
            </div>
          </div>

          <div className={estilosModal.section}>
            <label className={estilosModal.label}>
              Vista previa (hasta 10 primeros)
            </label>
            <div className={estilosModal.preview}>
              {selectedRows.slice(0, 10).map((lead, index) => {
                const email = lead.correo || (lead.nombre 
                  ? `${lead.nombre.toLowerCase().replace(/\s+/g, '')}@ejemplo.com`
                  : `lead${index + 1}@ejemplo.com`);
                
                return (
                  <div key={lead.id} className={estilosModal.previewItem}>
                    <div className={estilosModal.previewInfo}>
                      <span className={estilosModal.leadName}>
                        Lead {index + 1} #{lead.id}
                      </span>
                      <span className={estilosModal.leadContact}>
                        {email} - 910000000
                      </span>
                    </div>
                    <div className={estilosModal.previewBadges}>
                      <span className={estilosModal.badge}>{lead.origen || "Whatsapp"}</span>
                      <span className={estilosModal.badge}>
                        {lead.asesor && lead.asesor !== "Sin asesor" ? "Asignado" : "Sin Asignar"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            type="primary"
            className={estilosModal.confirmButton}
            size="large"
            block
            onClick={handleConfirmarAsignacion}
            disabled={!poolDestino}
          >
            Confirmar asignacion
          </Button>
        </div>
      </Modal>
    </div>
  );
}

