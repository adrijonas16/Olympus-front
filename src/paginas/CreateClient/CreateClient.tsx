import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import { insertarClientePotencial } from '../../config/rutasApi';
import './CreateClient.css';

const CreateClient: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const clienteData = {
        nombres: values.nombres,
        apellidos: values.apellido,
        pais: values.pais,
        celular: values.telefono,
        correo: values.correo,
        areaTrabajo: values.areaTrabajo,
        industria: values.industria
      };

      await insertarClientePotencial(clienteData);
      message.success('Cliente creado exitosamente');
      form.resetFields();
      navigate('/leads/SelectClient');
    } catch (error: any) {
      console.error('Error al crear cliente:', error);
      if (error?.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error?.message) {
        message.error('Error en validación: ' + error.message);
      } else {
        message.error('Error al crear el cliente');
      }
    } finally {
      setLoading(false);
    }
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
        width={650}
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
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={<span>Nombres<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="nombres"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span>Apellidos<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="apellidos"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
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
                name="celular"
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

          <Row gutter={12}>
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
            loading={loading}
            className="create-client-button"
            icon={!loading ? <span className="plus-icon">+</span> : undefined}
          >
            {loading ? 'Creando cliente...' : 'Crear nuevo cliente'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateClient;
