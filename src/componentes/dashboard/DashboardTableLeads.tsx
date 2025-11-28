import Table, { type Column } from '../table/Table';
import estilos from './Dashboard.module.css';
import { type Lead } from '../../config/leadsTableItems';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface DashboardTableLeadsProps {
  data?: Lead[];
  onSelectionChange?: (selectedRows: Lead[]) => void;
}

export default function DashboardTableLeads({ data = [], onSelectionChange }: DashboardTableLeadsProps) {
  const columns: Column<Lead>[] = [
    {
      key: 'id',
      label: 'IdLead',
      sortable: true
    },
    {
      key: 'codigoLanzamiento',
      label: 'Código Lanzamiento',
      sortable: true
    },
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'asesor',
      label: 'Asesor',
      sortable: true
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      render: (estado: string) => {
        const estadoLower = estado.toLowerCase();
        let badgeClass = estilos.badge;
        
        if (estadoLower === 'registrado') {
          badgeClass += ` ${estilos.badgeRegistrado}`;
        } else if (estadoLower === 'calificado') {
          badgeClass += ` ${estilos.badgeCalificado}`;
        } else if (estadoLower === 'matriculado' || estadoLower === 'cliente') {
          badgeClass += ` ${estilos.badgeMatriculado}`;
        } else if (estadoLower === 'pendiente') {
          badgeClass += ` ${estilos.badgePendiente}`;
        } else if (estadoLower === 'promesa') {
          badgeClass += ` ${estilos.badgePromesa}`;
        } else if (estadoLower === 'no calificado' || estadoLower === 'perdido') {
          badgeClass += ` ${estilos.badgeNoCalificado}`;
        } else {
          badgeClass += ` ${estilos.badgeDefault}`;
        }
        
        return (
          <span className={badgeClass}>
            {estado}
          </span>
        );
      }
    },
    {
      key: 'origen',
      label: 'Origen',
      sortable: true
    },
    {
      key: 'pais',
      label: 'País',
      sortable: true
    },
    {
      key: 'fechaFormulario',
      label: 'Fecha Formulario',
      sortable: true,
      render: (fecha: string) => {
        const [fechaParte, horaParte] = fecha.includes('|') 
          ? fecha.split('|') 
          : [fecha, ''];
        
        return (
          <div className={estilos.dateContainer}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              <CalendarOutlined style={{ color: "#6b7280" }} />
              <span>{fechaParte}</span>
            </div>
            {horaParte && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ClockCircleOutlined style={{ color: "#6b7280" }} />
                <span>{horaParte}</span>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  const handleSelectionChange = (selectedRows: Lead[]) => {
    onSelectionChange?.(selectedRows);
  };

  return (
    <div>
      <Table
        columns={columns}
        data={data}
        selectable={true}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
