import { useState } from 'react';
import { Layout, Table, Button, Tag, Space } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { User } from 'lucide-react';

const { Sider, Content, Header } = Layout;

export default function OpportunitiesInterface() {
  const [opportunities] = useState([
    {
      key: 1,
      date: '24 de setiembre de 2025',
      time: '23:00',
      name: 'Edson Mayra Escobedo',
      email: 'ejemplo@gmail.com',
      stage: 'Calificado',
      program: 'RH | 29 Ml',
      detail: 'Detalle de ejemplo'
    },
    {
      key: 2,
      date: '24 de setiembre de 2025',
      time: '23:00',
      name: 'Edson Mayra Escobedo',
      email: 'ejemplo@gmail.com',
      stage: 'Calificado',
      program: 'RH | 29 Ml',
      detail: 'Detalle de ejemplo'
    },
    {
      key: 3,
      date: '24 de setiembre de 2025',
      time: '23:00',
      name: 'Edson Mayra Escobedo',
      email: 'ejemplo@gmail.com',
      stage: 'Cliente',
      program: 'RH | 29 Ml',
      detail: 'Detalle de ejemplo'
    },
    {
      key: 4,
      date: '24 de setiembre de 2025',
      time: '23:00',
      name: 'Edson Mayra Escobedo',
      email: 'ejemplo@gmail.com',
      stage: 'Cliente',
      program: 'RH | 29 Ml',
      detail: 'Detalle de ejemplo'
    },
    {
      key: 5,
      date: '24 de setiembre de 2025',
      time: '23:00',
      name: 'Edson Mayra Escobedo',
      email: 'ejemplo@gmail.com',
      stage: 'Cliente',
      program: 'RH | 29 Ml',
      detail: 'Detalle de ejemplo'
    },
    {
      key: 6,
      date: '24 de setiembre de 2025',
      time: '23:00',
      name: 'Edson Mayra Escobedo',
      email: 'ejemplo@gmail.com',
      stage: 'Cliente',
      program: 'RH | 29 Ml',
      detail: 'Detalle de ejemplo'
    }
  ]);

  const columns = [
    {
      title: 'Fecha y Hora',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      render: (text: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <CalendarOutlined style={{ color: '#8c8c8c', marginTop: '2px' }} />
          <div>
            <div style={{ color: '#000000', fontSize: '14px' }}>{text}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8c8c8c', fontSize: '13px' }}>
              <ClockCircleOutlined style={{ fontSize: '12px' }} />
              {record.time}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Nombre Completo',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
      sorter: true
    },
    {
      title: 'Etapa',
      dataIndex: 'stage',
      key: 'stage',
      sorter: true,
      render: (stage: any) => (
        <Tag color={stage === 'Calificado' ? 'blue' : 'green'} style={{ borderRadius: '12px', padding: '2px 12px' }}>
          {stage}
        </Tag>
      )
    },
    {
      title: 'Programa',
      dataIndex: 'program',
      key: 'program',
      sorter: true
    },
    {
      title: 'Detalle',
      dataIndex: 'detail',
      key: 'detail'
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
    <Layout style={{ height: '100vh' }}>
      {/* Sidebar */}
      <Sider
        width={250}
        style={{
          background: '#1f1f1f',
          padding: '20px 0'
        }}
      >
      </Sider>

      {/* Main Content */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: '#fff',
            padding: '0 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>

          </h1>

          <div className="user-icon">
            <User />
          </div>
        </Header>

        {/* Content */}
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

            {/* Table */}
            <Table
              columns={columns}
              dataSource={opportunities}
              pagination={{ pageSize: 5 }}
              style={{
                fontSize: '14px'
              }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}