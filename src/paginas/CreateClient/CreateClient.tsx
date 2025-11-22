import React from 'react';
import { Form, Input, Button, Row, Col, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import './CreateClient.css';

const CreateClient: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('Datos del cliente:', values);
      message.success('Cliente creado exitosamente');
      form.resetFields();
      // Puedes redirigir a otra página después de crear el cliente
      // navigate('/leads/SalesProcess');
    }).catch((error) => {
      console.error('Error en validación:', error);
    });
  };

  const handleClose = () => {
    navigate(-1); // Volver a la página anterior
  };

  return (
    <div className="create-client-page">
      <Modal
        open={true}
        onCancel={handleClose}
        footer={null}
        width={1200}
        centered
        closeIcon={<CloseOutlined />}
        className="create-client-modal"
      >
        <div className="create-client-header">
          <h2 className="create-client-title">Crear Cliente</h2>
        </div>

        <Form
          form={form}
          layout="vertical"
          className="create-client-form"
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span>Nombres<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="nombre"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span>Apellidos<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="apellido"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span>Pais<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="pais"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span>Teléfono<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="telefono"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item
                label={<span>Correo<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="correo"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span>Área de trabajo<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="areaTrabajo"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span>Industria<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="industria"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            block
            onClick={handleSubmit}
            className="create-client-button"
            icon={<span className="plus-icon">+</span>}
          >
            Crear nuevo cliente
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateClient;
