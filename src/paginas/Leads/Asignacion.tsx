import { useState, useEffect, useMemo } from "react";
import { Input, Select, Button, Modal, Checkbox, Spin, message } from "antd";
import { SearchOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import DashboardTableLeads from "../../componentes/dashboard/DashboardTableLeads";
import { type Lead } from "../../config/leadsTableItems";
import estilos from "./Asignacion.module.css";
import estilosModal from "./ReasignacionMasiva.module.css";
import axios from "axios";
import Cookies from "js-cookie";

const { Option } = Select;

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
  const [filterPrioridad, setFilterPrioridad] = useState<string>("Todas prioridades");
  const [modalOpen, setModalOpen] = useState(false);
  const [poolDestino, setPoolDestino] = useState<string>("");
  const [forzarReasignacion, setForzarReasignacion] = useState(true);
  const [agregarComentario, setAgregarComentario] = useState(true);
  const [oportunidades, setOportunidades] = useState<OportunidadBackend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSelectionChange = (selected: Lead[]) => {
    setSelectedRows(selected);
  };

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
    setFilterPrioridad("Todas prioridades");
  };

  const handleAgregarLeads = () => {
    console.log("Agregar nuevos leads");
  };

  const mapearOportunidadALead = (oportunidad: OportunidadBackend): Lead => {
    const fecha = new Date(oportunidad.fechaCreacion);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const horaFormateada = fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      id: oportunidad.id,
      codigoLanzamiento: oportunidad.codigoLanzamiento || '-',
      nombre: oportunidad.personaNombre || '-',
      asesor: 'Sin asesor',
      estado: oportunidad.nombreEstado || '-',
      origen: oportunidad.origen || '-',
      pais: 'Peru', 
      fechaFormulario: `${fechaFormateada}|${horaFormateada}`, 
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
        setOportunidades(data.oportunidad);
        console.log("✅ Oportunidades obtenidas:", data.oportunidad.length);
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

    return filtrados;
  }, [leadsMapeados, searchText, filterEstado, filterPrioridad]);

  return (
    <div className={estilos.container}>
      <div className={estilos.contentWrapper}>
        <div className={estilos.header}>
          <h1 className={estilos.title}>Oportunidades</h1>
        </div>

        <div className={estilos.toolbar}>
          <div className={estilos.searchFilters}>
            <Input
              placeholder="Buscar por nombre, telefono, email u origen."
              prefix={<SearchOutlined />}
              className={estilos.searchInput}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={filterEstado}
              onChange={setFilterEstado}
              className={estilos.filterSelect}
              placeholder="Filtrar por estado"
            >
              <Option value="Todos">Todos</Option>
              {estadosUnicos.map(estado => (
                <Option key={estado} value={estado}>{estado}</Option>
              ))}
            </Select>
            <Select
              value={filterPrioridad}
              onChange={setFilterPrioridad}
              className={estilos.filterSelect}
            >
              <Option value="Todas prioridades">Todas prioridades</Option>
              <Option value="Alta">Alta</Option>
              <Option value="Media">Media</Option>
              <Option value="Baja">Baja</Option> 
            </Select>
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
              <DashboardTableLeads 
                data={leadsFiltrados}
                onSelectionChange={handleSelectionChange} 
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

