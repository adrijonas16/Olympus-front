import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button, Card, Badge, Layout, Spin, Alert } from "antd";
import "./SalesProcess.css";

// Definimos una interfaz para tipar los datos de las oportunidades de la API
interface Opportunity {
  id: number;
  personaNombre: string;
  nombreEstado: string;
  productoNombre: string;
  fechaCreacion: string; // Asumiendo que la API devuelve una fecha como string
  // Puedes añadir más campos si los necesitas para la tarjeta o la lógica
}

// El componente SalesCard ahora recibe una oportunidad tipada
const SalesCard = ({ sale }: { sale: Opportunity }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/leads/oportunidades/${sale.id}`);
  };

  return (
    <Card size="small" className="client-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="client-name">{sale.personaNombre}</div>
      {/* Usamos productoNombre como el "precio" o identificador del producto */}
      <div className="client-price">{sale.productoNombre}</div>
      <div className="client-date">
        <Calendar size={14} /> <span>{new Date(sale.fechaCreacion).toLocaleDateString()}</span>
      </div>
    </Card>
  );
};

const { Content } = Layout;

export default function SalesProcess() {
  const [activeFilter, setActiveFilter] = useState("todos");
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRyaWFuYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpcCI6InN0cmluZyIsImV4cCI6MTc2MzM2NDUzNiwiaXNzIjoiT2x5bXB1c0FQSSIsImF1ZCI6Ik9seW1wdXNVc2VycyJ9.2UltQ21-X_2EqOS8LVvPYl1iRddQt3UypWto9y65p7k";

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:7020/api/VTAModVentaOportunidad/ObtenerTodasConRecordatorio', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error al obtener los datos: ${response.statusText}`);
        }
        const data = await response.json();
        // El array de oportunidades está dentro de la propiedad 'oportunidad'
        setOpportunities(data.oportunidad || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []); // Se ejecutará solo una vez, cuando el componente se monte

  // Categorizamos las oportunidades obtenidas de la API en las estructuras existentes
  const categorizedData = useMemo(() => {
    const initialSalesData: { [key: string]: Opportunity[] } = {
      registrado: [],
      calificado: [],
      potencial: [],
      promesa: [],
    };
    const initialOtrosEstados: { [key: string]: Opportunity[] } = {
      pendiente: [],
      matriculado: [],
      noCalificado: [],
      coorporativo: [],
    };

    opportunities.forEach(op => {
      switch (op.nombreEstado) {
        case 'Registrado':
          initialSalesData.registrado.push(op);
          break;
        case 'Potencial':
          initialSalesData.potencial.push(op);
          break;
        case 'Promesa':
          initialSalesData.promesa.push(op);
          break;
        case 'Calificado':
          initialSalesData.calificado.push(op);
          break;
        case 'Matriculado':
          initialOtrosEstados.matriculado.push(op);
          break;
        case 'No calificado':
          initialOtrosEstados.noCalificado.push(op);
          break;
        default:
          // Oportunidades con estados no mapeados no se mostrarán en estas columnas
          console.warn(`Oportunidad con estado no mapeado: ${op.nombreEstado}`);
          break;
      }
    });
    return { salesData: initialSalesData, otrosEstados: initialOtrosEstados };
  }, [opportunities]);

  const { salesData, otrosEstados } = categorizedData;

  // Actualizamos los filtros para que reflejen los conteos reales de la API
  const filters = useMemo(() => [
    { key: "todos", label: "Todos", count: Object.values(otrosEstados).flat().length },
    { key: "pendiente", label: "Pendiente", count: otrosEstados.pendiente.length },
    { key: "matriculado", label: "Matriculado", count: otrosEstados.matriculado.length },
    { key: "noCalificado", label: "No Calificado", count: otrosEstados.noCalificado.length },
    { key: "coorporativo", label: "Coorporativo", count: otrosEstados.coorporativo.length },
  ], [otrosEstados]);

  const getFilteredData = () =>
    activeFilter === "todos"
      ? Object.values(otrosEstados).flat()
      : otrosEstados[activeFilter as keyof typeof otrosEstados] || [];

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ padding: '20px', background: '#f5f5f5' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button>Agregar Oportunidad</Button>
          <Button>Vista de Proceso</Button>
          <Button
            type="primary"
            style={{ background: '#1f1f1f', borderColor: '#1f1f1f', borderRadius: '6px' }}
            onClick={() => navigate('/leads/Opportunities')}
          >
            Vista de Tabla
          </Button>
        </div>

        <div className="content-wrapper">
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Proceso de Ventas
          </h1>

          {/* Sección principal */}
          <div className="sales-section">
            <div className="stages-grid">
              {Object.entries(salesData).map(([stage, items]) => (
                <div key={stage} className={`stage-column ${stage}`}>
                  <div className="stage-header">
                    <span className="stage-title">
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </span>
                    <Badge count={items.length} style={{ backgroundColor: "#1677ff" }} />
                  </div>
                  <div className="card-list-container">
                    {items.map((sale) => (
                      <SalesCard key={sale.id} sale={sale} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Otros estados */}
          <div className="sales-section">
            <div className="other-states-header">
              <h3>Otros Estados</h3>
              <span className="total-count">({getFilteredData().length})</span>
            </div>

            {/* Botones de filtros */}
            <div className="filters-container">
              <div className="filters">
                {filters.map((filtro) => (
                  <Button
                    key={filtro.key}
                    size="small"
                    type={activeFilter === filtro.key ? "primary" : "default"}
                    onClick={() => setActiveFilter(filtro.key)}
                    className={`filter-btn ${activeFilter === filtro.key ? "active" : ""}`}
                  >
                    {`${filtro.label} (${filtro.count})`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Contenedor dinámico según filtro */}
            <div className="other-states-grid">
              {activeFilter === "todos"
                ? Object.entries(otrosEstados).map(([estado, items]) => (
                  <div key={estado} className="other-state-column">
                    <div className="column-header">
                      <span>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
                      <Badge count={items.length} style={{ backgroundColor: "#1677ff" }} />
                    </div>
                    <div className={`state-content ${estado}`}>
                      {items.length > 0 ? (
                        items.map((sale) => <SalesCard key={sale.id} sale={sale} />)
                      ) : (
                        <div className="empty-box"></div>
                      )}
                    </div>
                  </div>
                ))
                : (
                  <div className="other-state-column">
                    <div className="column-header">
                      <span>{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</span>
                      <Badge count={getFilteredData().length} style={{ backgroundColor: "#1677ff" }} />
                    </div>
                    <div className={`state-content ${activeFilter}`}>
                      {getFilteredData().length > 0 ? (
                        getFilteredData().map((sale) => <SalesCard key={sale.id} sale={sale} />)
                      ) : (
                        <div className="empty-box"></div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}