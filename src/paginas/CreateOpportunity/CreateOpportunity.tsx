import React from 'react';
import { Form, Input, Button, DatePicker, Modal, message, Card, TimePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import './CreateOpportunity.css';

const CreateOpportunity: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('Datos de la oportunidad:', values);
      message.success('Oportunidad creada exitosamente');
      form.resetFields();
      // Redirigir después de crear
      // navigate('/leads/Opportunities');
    }).catch((error) => {
      console.error('Error en validación:', error);
    });
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
            <h3 className="client-name">Eswin Mejía Escobedo</h3>
            <p className="client-phone">+51 9800 9374 2069</p>
            <p className="client-email">eswin_mejia@gmail.com</p>
          </div>
          <div className="opportunities-badge">
            Oportunidades relacionadas: 3
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
          >
            Crear Oportunidad
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateOpportunity;
