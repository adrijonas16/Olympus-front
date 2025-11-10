import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button, Card, Badge } from "antd";
import "./SalesProcess.css";

// ✅ Componente SalesCard fuera del componente principal para optimización
const SalesCard = ({ sale }: { sale: { id: number; name: string; price: string; date: string } }) => (
  <Card size="small" className="client-card">
    <div className="client-name">{sale.name}</div>
    <div className="client-price">{sale.price}</div>
    <div className="client-date">
      <Calendar size={14} /> <span>{sale.date}</span>
    </div>
  </Card>
);

export default function SalesProcess() {
  const [activeFilter, setActiveFilter] = useState("todos");

  const salesData = {
    registrado: [
      { id: 1, name: "Edson Marjo Escobedo", price: "R$ 2 GB", date: "24/09/2025 23:00" },
      { id: 2, name: "Edson Marjo Escobedo", price: "R$ 58 GB", date: "24/09/2025 23:00" },      
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

  const otrosEstados = {
    pendiente: [],
    cliente: [
      { id: 9, name: "Edson Marjo Escobedo", price: "R$ 25 GB", date: "24/09/2025 23:00" },
    ],
    noCalificado: [],
    perdido: [],
  };

  // ✅ Filtros dinámicos para la sección "Otros Estados"
  const filters = [
    { key: "todos", label: "Todos", count: Object.values(otrosEstados).flat().length },
    { key: "pendiente", label: "Pendiente", count: otrosEstados.pendiente.length },
    { key: "cliente", label: "Cliente", count: otrosEstados.cliente.length },
    { key: "noCalificado", label: "No Calificado", count: otrosEstados.noCalificado.length },
    { key: "perdido", label: "Perdido", count: otrosEstados.perdido.length }
  ];

  const getFilteredData = () => {
    if (activeFilter === "todos") {
      // Object.values(otrosEstados).flat() es una forma más corta de unir todos los arrays
      return Object.values(otrosEstados).flat();
    }
    // Devuelve el array correspondiente al filtro o un array vacío si no existe
    return otrosEstados[activeFilter as keyof typeof otrosEstados] || [];
  };

  return (
    <div className="app-layout">
      {/* Sidebar fijo (simula el menú lateral) */}
      <div className="sidebar"></div>

      {/* Contenido principal */}
      <div className="sales-container">
        {/* Header */}
        <div className="sales-header">
          <h2></h2>
          <div className="header-actions">
            <Button>Agregar Oportunidad</Button>
            <Button>Vista de Proceso</Button>
            <Button 
                type="primary" 
                style={{ 
                  background: '#1f1f1f',
                  borderColor: '#1f1f1f',
                  borderRadius: '6px'
                }}
              >
                Vista de Tabla
              </Button>
          </div>
        </div>

        {/* Sección principal */}
        <div className="sales-section">
          <h3>Proceso de Ventas</h3>
          <div className="stages-grid">
            {Object.entries(salesData).map(([stage, items]) => (
              <div key={stage} className="stage-column">
                <div className="stage-header">
                  <span className="stage-title">
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </span>
                  <Badge count={items.length} style={{ backgroundColor: '#1677ff' }} />
                </div>
                {items.map((sale) => (
                  <SalesCard key={sale.id} sale={sale} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Otros estados */}
        <div className="sales-section">
          <h3>Otros Estados ({getFilteredData().length})</h3>
          <div className="filters">
            {filters.map((filtro) => (
              <Button
                key={filtro.key}
                size="small"
                type={activeFilter === filtro.key ? "primary" : "default"}
                onClick={() => setActiveFilter(filtro.key)}
              >
                {`${filtro.label} (${filtro.count})`}
              </Button>
            ))}
          </div>

          {/* ✅ Usamos la nueva clase para la rejilla de resultados */}
          <div className="filtered-results-grid">
            {getFilteredData().length > 0 ? (
              getFilteredData().map((sale) => <SalesCard key={sale.id} sale={sale} />)
            ) : (
              <div className="no-data">No hay registros en esta categoría</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}