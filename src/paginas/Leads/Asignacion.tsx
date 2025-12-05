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

export default function Asignacion() {
  const [selectedRows, setSelectedRows] = useState<Lead[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [filterPrioridad, setFilterPrioridad] = useState<string>("Todas prioridades");
  const [modalOpen, setModalOpen] = useState(false);
  const [asesorDestino, setAsesorDestino] = useState<number | null>(null);
  const [forzarReasignacion, setForzarReasignacion] = useState(true);
  const [oportunidades, setOportunidades] = useState<OportunidadBackend[]>([]);
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAsesores, setLoadingAsesores] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = Cookies.get("token");

  const handleSelectionChange = (selected: Lead[]) => setSelectedRows(selected);

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


  const obtenerOportunidades = async () => {
    try {
      setLoading(true);
      if (!token) throw new Error("No se encontró el token de autenticación");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:7020"}/api/VTAModVentaOportunidad/ObtenerTodasConRecordatorio`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      if (data?.oportunidad) setOportunidades(data.oportunidad);
      else setOportunidades([]);
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
    pais: 'Peru',
    fechaFormulario: new Date(o.fechaCreacion).toLocaleString('es-ES')
  })), [oportunidades]);

  const estadosUnicos = useMemo(() => Array.from(new Set(oportunidades.map(o => o.nombreEstado))).sort(), [oportunidades]);

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

    if (filterEstado !== "Todos") filtrados = filtrados.filter(l => l.estado === filterEstado);

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
            <Input placeholder="Buscar por nombre, telefono, email u origen." prefix={<SearchOutlined />} className={estilos.searchInput} value={searchText} onChange={e => setSearchText(e.target.value)} />
            <Select value={filterEstado} onChange={setFilterEstado} className={estilos.filterSelect} placeholder="Filtrar por estado">
              <Option value="Todos">Todos</Option>
              {estadosUnicos.map(estado => <Option key={estado} value={estado}>{estado}</Option>)}
            </Select>
            <Select value={filterPrioridad} onChange={setFilterPrioridad} className={estilos.filterSelect}>
              <Option value="Todas prioridades">Todas prioridades</Option>
              <Option value="Alta">Alta</Option>
              <Option value="Media">Media</Option>
              <Option value="Baja">Baja</Option>
            </Select>
          </div>

          <div className={estilos.actions}>
            <Button type="primary" disabled={selectedRows.length === 0} onClick={handleReasignarMasivo}>Reasignar masivo</Button>
            <Button onClick={() => { setSearchText(""); setFilterEstado("Todos"); setFilterPrioridad("Todas prioridades"); }}>Limpiar filtros</Button>
            <Button type="default" icon={<PlusOutlined />} onClick={() => console.log("Agregar nuevos leads")}>Agregar Nuevos Leads</Button>
          </div>
        </div>

        <div className={estilos.tableWrapper}>
          {loading ? <Spin size="large" /> : error ? <div style={{ color: "#ff4d4f" }}>{error}</div> :
            <>
              <DashboardTableLeads data={leadsFiltrados} onSelectionChange={handleSelectionChange} />
              {selectedRows.length > 0 && <div>{selectedRows.length} Oportunidades seleccionadas</div>}
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
    </div>
  );
}
