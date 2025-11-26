import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Table, Button, Tag, Space, Spin, Alert, Tooltip } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EyeOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import SelectClient from "../SelectClient/SelectClient";
import { getCookie } from '../../utils/cookies';

const { Content } = Layout;

// Definimos una interfaz para tipar los datos de las oportunidades de la API
interface Opportunity {
  id: number;
  personaNombre: string;
  nombreEstado: string;
  productoNombre: string;
  fechaCreacion: string;
  personaCorreo: string;
  fechaRecordatorio: string | null;
}

export default function OpportunitiesInterface() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelectClientModalVisible, setIsSelectClientModalVisible] = useState(false);
  const navigate = useNavigate();

  const token = getCookie("token");
  
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/VTAModVentaOportunidad/ObtenerTodasConRecordatorio', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error al obtener los datos: ${response.statusText}`);
        }
        const data = await response.json();
        setOpportunities(data.oportunidad || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleClick = (id: number) => {
    navigate(`/leads/oportunidades/${id}`);
  };

  const columns = [
    {
      title: 'Fecha y Hora',
      dataIndex: 'fechaCreacion',
      key: 'fechaCreacion',
      sorter: (a: Opportunity, b: Opportunity) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime(),
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
    },
    {
      title: 'Nombre Completo',
      dataIndex: 'personaNombre',
      key: 'personaNombre',
      sorter: (a: Opportunity, b: Opportunity) => a.personaNombre.localeCompare(b.personaNombre)
    },
    {
      title: 'Correo',
      dataIndex: 'personaCorreo',
      key: 'personaCorreo',
      sorter: (a: Opportunity, b: Opportunity) => (a.personaCorreo || '').localeCompare(b.personaCorreo || ''),
      render: (personaCorreo: string) => personaCorreo || '-'
    },
    {
      title: 'Etapa',
      dataIndex: 'nombreEstado',
      key: 'nombreEstado',
      sorter: (a: Opportunity, b: Opportunity) => a.nombreEstado.localeCompare(b.nombreEstado),
      render: (nombreEstado: string) => {
        let color = 'green';

        if (nombreEstado === 'Calificado') {
          color = 'blue';
        } else if (nombreEstado === 'Promesa') {
          color = 'gold';
        } else if (nombreEstado === 'No calificado') {
          color = 'red';
        }

        return (
          <Tag color={color} style={{ borderRadius: '12px', padding: '2px 12px' }}>
            {nombreEstado}
          </Tag>
        );
      }
    },
    {
      title: 'Programa',
      dataIndex: 'productoNombre',
      key: 'productoNombre',
      sorter: (a: Opportunity, b: Opportunity) => a.productoNombre.localeCompare(b.productoNombre)
    },
    {
      title: 'Recordatorio',
      dataIndex: 'fechaRecordatorio',
      key: 'fechaRecordatorio',
      sorter: (a: Opportunity, b: Opportunity) => {
        if (!a.fechaRecordatorio && !b.fechaRecordatorio) return 0;
        if (!a.fechaRecordatorio) return 1;
        if (!b.fechaRecordatorio) return -1;
        return new Date(a.fechaRecordatorio).getTime() - new Date(b.fechaRecordatorio).getTime();
      },
      render: (fechaRecordatorio: string | null) => {
        if (!fechaRecordatorio) return '-';
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#1677ff',
            color: '#ffffff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500
          }}>
            <FileTextOutlined style={{ fontSize: '12px' }} />
            <span>
              {new Date(fechaRecordatorio).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })} {new Date(fechaRecordatorio).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </span>
          </div>
        );
      }
    },
    {
      title: 'Asesor',
      dataIndex: 'asesor', // Este campo no viene en la API
      key: 'asesor',
      render: () => '-' // Mostramos un guion ya que no hay dato
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Opportunity) => (
        <Space size="small">
          <Tooltip title="Ver Detalle">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              style={{ backgroundColor: '#1f1f1f', borderColor: '#1f1f1f' }}
              onClick={() => handleClick(record.id)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              style={{ backgroundColor: '#1f1f1f', borderColor: '#1f1f1f' }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
        <Content style={{ padding: '20px', background: '#f5f5f5' }}>
          {/* Action Buttons */}
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}>
            <Button style={{ borderRadius: '6px' }} onClick={() => setIsSelectClientModalVisible(true)}>
              Agregar Oportunidad
            </Button>
            <Button
              style={{ borderRadius: '6px' }}
              onClick={() => navigate('/leads/SalesProcess')}
            >
              Vista de Proceso
            </Button>
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

          <SelectClient
            visible={isSelectClientModalVisible}
            onClose={() => setIsSelectClientModalVisible(false)}
          />

          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
              Oportunidades
            </h1>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><Spin size="large" /></div>
            ) : error ? (
              <Alert message="Error" description={error} type="error" showIcon />
            ) : (
              <Table
                columns={columns}
                dataSource={opportunities}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                style={{
                  fontSize: '14px'
                }}
              />
            )}
          </div>
        </Content>
  );
}