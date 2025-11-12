import { useState } from "react";
import { Calendar, User } from "lucide-react";
import { Button, Card, Badge, Layout } from "antd";
import "./SalesProcess.css";

const SalesCard = ({ sale }: { sale: { id: number; name: string; price: string; date: string } }) => (
  <Card size="small" className="client-card">
    <div className="client-name">{sale.name}</div>
    <div className="client-price">{sale.price}</div>
    <div className="client-date">
      <Calendar size={14} /> <span>{sale.date}</span>
    </div>
  </Card>
);

const { Content } = Layout;

export default function SalesProcess() {
  const [activeFilter, setActiveFilter] = useState("todos");

  const salesData = {
    registrado: [
      { id: 1, name: "Edson Marjo Escobedo", price: "R$ 2 GB", date: "24/09/2025 23:00" },
      { id: 2, name: "Edson Marjo Escobedo", price: "R$ 58 GB", date: "24/09/2025 23:00" },
      { id: 3, name: "Edson Marjo Escobedo", price: "R$ 58 GB", date: "24/09/2025 23:00" },
      { id: 4, name: "Edson Marjo Escobedo", price: "R$ 58 GB", date: "24/09/2025 23:00" },
    ],
    calificado: [
      { id: 3, name: "Edson Marjo Escobedo", price: "R$ 25 GB", date: "24/09/2025 23:00" },
    ],
    potencial: [
      { id: 4, name: "Edson Marjo Escobedo", price: "R$ 2 GB", date: "24/09/2025 23:00" },
    ],
    promesa: [
      { id: 5, name: "Edson Marjo Escobedo", price: "R$ 2 GB", date: "24/09/2025 23:00" },
      { id: 6, name: "Edson Marjo Escobedo", price: "R$ 25 GB", date: "24/09/2025 23:00" },
    ],
  };

    // ==== Otros Estados ====
  const otrosEstados = {
    pendiente: [
      { id: 7, name: "Edson Marjo Escobedo", price: "R$ 12 GB", date: "24/09/2025 23:00" },
    ],
    matriculado: [
      { id: 8, name: "Edson Marjo Escobedo", price: "R$ 25 GB", date: "25/09/2025 10:15" },
    ],
    noCalificado: [
      { id: 9, name: "Edson Marjo Escobedo", price: "R$ 20 GB", date: "25/09/2025 12:45" },
    ],
    coorporativo: [
      { id: 10, name: "Edson Marjo Escobedo", price: "R$ 35 GB", date: "25/09/2025 14:00" },
    ],
  };

  const filters = [
    { key: "todos", label: "Todos", count: Object.values(otrosEstados).flat().length },
    { key: "pendiente", label: "Pendiente", count: otrosEstados.pendiente.length },
    { key: "matriculado", label: "Matriculado", count: otrosEstados.matriculado.length },
    { key: "noCalificado", label: "No Calificado", count: otrosEstados.noCalificado.length },
    { key: "coorporativo", label: "Coorporativo", count: otrosEstados.coorporativo.length },
  ];

  const getFilteredData = () =>
    activeFilter === "todos"
      ? Object.values(otrosEstados).flat()
      : otrosEstados[activeFilter as keyof typeof otrosEstados] || [];

  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ padding: '20px', background: '#f5f5f5' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button>Agregar Oportunidad</Button>
          <Button>Vista de Proceso</Button>
          <Button type="primary" style={{ background: '#1f1f1f', borderColor: '#1f1f1f', borderRadius: '6px' }}>
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
                <div key={stage} className="stage-column">
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