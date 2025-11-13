import { useState, useEffect } from 'react';
import { Layout, Table, Button, Tag, Space, Spin, Alert } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Content } = Layout;

// Definimos una interfaz para tipar los datos de las oportunidades de la API
interface Opportunity {
  id: number;
  personaNombre: string;
  nombreEstado: string;
  productoNombre: string;
  fechaCreacion: string;
  // El correo no viene en la API, lo manejaremos en el render
}

// Token de autorización
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW5pc3RyYWRvciIsImlwIjoic3RyaW5nIiwiZXhwIjoxNzYzMDg5NzIyLCJpc3MiOiJPbHltcHVzQVBJIiwiYXVkIjoiT2x5bXB1c1VzZXJzIn0.cpgyro01D1YVqXPaOs8BIlFV_dc2Xq1gcuY9jrI9wwA";

export default function OpportunitiesInterface() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRyaWFuYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpcCI6InN0cmluZyIsImV4cCI6MTc2MzA4OTcyMiwiaXNzIjoiT2x5bXB1c0FQSSIsImF1ZCI6Ik9seW1wdXNVc2VycyJ9.cpgyro01D1YVqXPaOs8BIlFV_dc2Xq1gcuY9jrI9wwA";
  
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
        setOpportunities(data.oportunidad || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

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
      dataIndex: 'correo', // Este campo no viene en la API
      key: 'correo',
      render: () => '-' // Mostramos un guion ya que no hay dato
    },
    {
      title: 'Etapa',
      dataIndex: 'nombreEstado',
      key: 'nombreEstado',
      sorter: (a: Opportunity, b: Opportunity) => a.nombreEstado.localeCompare(b.nombreEstado),
      render: (nombreEstado: string) => (
        <Tag color={nombreEstado === 'Calificado' ? 'blue' : 'green'} style={{ borderRadius: '12px', padding: '2px 12px' }}>
          {nombreEstado}
        </Tag>
      )
    },
    {
      title: 'Programa',
      dataIndex: 'productoNombre',
      key: 'productoNombre',
      sorter: (a: Opportunity, b: Opportunity) => a.productoNombre.localeCompare(b.productoNombre)
    },
    {
      title: 'Detalle',
      dataIndex: 'detalle', // Este campo no viene en la API
      key: 'detalle',
      render: () => '-' // Mostramos un guion ya que no hay dato
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            style={{ backgroundColor: '#1f1f1f', borderColor: '#1f1f1f' }}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            style={{ backgroundColor: '#1f1f1f', borderColor: '#1f1f1f' }}
          />
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
            <Button style={{ borderRadius: '6px' }}>
              Agregar Oportunidad
            </Button>
            <Button style={{ borderRadius: '6px' }}>
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