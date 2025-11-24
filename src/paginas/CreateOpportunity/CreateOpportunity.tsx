import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Modal, message, Card, TimePicker } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { insertarOportunidadHistorialRegistrado } from '../../config/rutasApi';
import './CreateOpportunity.css';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  opportunities: number;
}

const CreateOpportunity: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const client = (location.state as { client?: Client })?.client;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Obtener el IdPotencialCliente del cliente seleccionado
      const idPotencialCliente = client?.id ? parseInt(client.id) : 0;

      if (!idPotencialCliente) {
        message.error('No se ha seleccionado un cliente válido');
        return;
      }

      // Formatear la fecha en formato ISO (YYYY-MM-DDTHH:mm:ss)
      const fechaRecordatorio = dayjs(values.fecha).format('YYYY-MM-DDTHH:mm:ss');

      // Formatear la hora en formato HH:mm
      const horaRecordatorio = dayjs(values.hora).format('HH:mm');

      // Preparar los datos según la estructura requerida
      const payload = {
        IdPotencialCliente: idPotencialCliente,
        IdProducto: 1, // Valor por defecto, puedes ajustarlo según tus necesidades
        CodigoLanzamiento: values.lanzamiento,
        Origen: 'Manual',
        Estado: true,
        FechaRecordatorio: fechaRecordatorio,
        HoraRecordatorio: horaRecordatorio,
        UsuarioCreacion: 'SYSTEM',
        UsuarioModificacion: 'SYSTEM'
      };

      // Llamar al endpoint
      const response = await insertarOportunidadHistorialRegistrado(payload);

      message.success('Oportunidad creada exitosamente');
      form.resetFields();

      // Redirigir después de crear
      navigate('/leads/Opportunities');
    } catch (error: any) {
      console.error('Error al crear oportunidad:', error);
      if (error?.response?.data?.message) {
        message.error(`Error: ${error.response.data.message}`);
      } else {
        message.error('Error al crear la oportunidad');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1); // Volver a la página anterior
  };

  return (
    <div className="create-opportunity-page">
      <Modal
        open={true}
        onCancel={handleClose}
        footer={null}
        width={900}
        centered
        closeIcon={<CloseOutlined />}
        className="create-opportunity-modal"
      >
        <div className="create-opportunity-header">
          <h2 className="create-opportunity-title">Crear Oportunidad</h2>
        </div>

        <Card className="client-info-card">
          <div className="client-info-content">
            <h3 className="client-name">{client?.name || 'Eswin Mejía Escobedo'}</h3>
            <p className="client-phone">{client?.phone || '+51 9800 9374 2069'}</p>
            <p className="client-email">{client?.email || 'eswin_mejia@gmail.com'}</p>
          </div>
          <div className="opportunities-badge">
            Oportunidades relacionadas: {client?.opportunities || 3}
          </div>
        </Card>

        <Form
          form={form}
          layout="vertical"
          className="create-opportunity-form"
          requiredMark={false}
        >
          <Form.Item
            label={<span>Lanzamiento<span style={{ color: '#ff4d4f' }}>*</span></span>}
            name="lanzamiento"
            rules={[{ required: true, message: '' }]}
          >
            <Input placeholder="" />
          </Form.Item>

          <div className="date-time-row">
            <Form.Item
              label={<span>Fecha<span style={{ color: '#ff4d4f' }}>*</span></span>}
              name="fecha"
              rules={[{ required: true, message: '' }]}
              className="date-field"
            >
              <DatePicker
                placeholder=""
                suffixIcon={<CalendarOutlined />}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              label={<span>Hora<span style={{ color: '#ff4d4f' }}>*</span></span>}
              name="hora"
              rules={[{ required: true, message: '' }]}
              className="time-field"
            >
              <TimePicker
                placeholder=""
                format="HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <div className="scheduled-container">
            <div className="scheduled-label">
              Programado para: Sábado, 04 de octubre de 2025 a las 09:00 horas
            </div>
            <div className="scheduled-text">
              ISO-8859-19-14374-00-00022
            </div>
          </div>

          <Button
            type="primary"
            block
            onClick={handleSubmit}
            className="create-opportunity-button"
            icon={<span className="plus-icon">+</span>}
            loading={loading}
            disabled={loading}
          >
            Crear Oportunidad
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateOpportunity;
