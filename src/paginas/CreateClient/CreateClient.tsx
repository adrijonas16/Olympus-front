import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Modal, message, Select, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import { insertarClientePotencial, obtenerPaises, type Pais } from '../../config/rutasApi';
import './CreateClient.css';

const CreateClient: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [indicativo, setIndicativo] = useState('+51'); // Perú por defecto
  const [paisSeleccionado, setPaisSeleccionado] = useState<Pais | null>(null);

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        setLoadingPaises(true);
        const paisesData = await obtenerPaises();
        // Filtrar solo países activos
        const paisesActivos = paisesData.filter(p => p.estado);
        setPaises(paisesActivos);

        // Buscar Perú y establecerlo como país por defecto
        const peru = paisesActivos.find(p => p.nombre === 'Perú');
        if (peru) {
          setPaisSeleccionado(peru);
          setIndicativo(`+${peru.prefijoCelularPais}`);
          form.setFieldsValue({ pais: peru.nombre });
        }
      } catch (error) {
        console.error('Error al cargar países:', error);
        message.error('Error al cargar la lista de países');
      } finally {
        setLoadingPaises(false);
      }
    };

    cargarPaises();
  }, [form]);

  const handlePaisChange = (paisNombre: string) => {
    const pais = paises.find(p => p.nombre === paisNombre);
    if (pais) {
      setPaisSeleccionado(pais);
      setIndicativo(`+${pais.prefijoCelularPais}`);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const clienteData = {
        nombres: values.nombres,
        apellidos: values.apellidos,
        pais: values.pais,
        prefijoPaisCelular: indicativo,
        celular: values.celular,
        correo: values.correo,
        areaTrabajo: values.areaTrabajo,
        industria: values.industria
      };

      await insertarClientePotencial(clienteData);
      message.success('Cliente creado exitosamente');
      form.resetFields();

      // Resetear al país por defecto (Perú)
      const peru = paises.find(p => p.nombre === 'Perú');
      if (peru) {
        setPaisSeleccionado(peru);
        setIndicativo(`+${peru.prefijoCelularPais}`);
        form.setFieldsValue({ pais: peru.nombre });
      }

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
                rules={[{ required: true, message: 'Los nombres son requeridos' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span>Apellidos<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="apellidos"
                rules={[{ required: true, message: 'Los apellidos son requeridos' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={10}>
              <Form.Item
                label={<span>País<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="pais"
                rules={[{ required: true, message: 'El país es requerido' }]}
              >
                <Select
                  placeholder="Seleccionar país"
                  onChange={handlePaisChange}
                  showSearch
                  loading={loadingPaises}
                  disabled={loadingPaises}
                  filterOption={(input, option) =>
                    (option?.children?.toString() || '').toLowerCase().includes(input.toLowerCase())
                  }
                  notFoundContent={loadingPaises ? <Spin size="small" /> : 'No hay países disponibles'}
                >
                  {paises.map(pais => (
                    <Select.Option key={pais.id} value={pais.nombre}>
                      {pais.nombre}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item
                label={<span style={{ fontSize: '12px' }}>Ind.</span>}
              >
                <Input value={indicativo} disabled style={{ textAlign: 'center', fontSize: '13px', padding: '4px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span>Teléfono<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="celular"
                rules={[
                  { required: true, message: 'El teléfono es requerido' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      // Validar que solo contenga números
                      if (!/^\d+$/.test(value)) {
                        return Promise.reject('El teléfono debe contener solo números');
                      }

                      // Validar longitud basada en el país seleccionado
                      if (paisSeleccionado) {
                        const longitud = value.length;
                        const { digitoMinimo, digitoMaximo } = paisSeleccionado;

                        if (longitud < digitoMinimo || longitud > digitoMaximo) {
                          return Promise.reject(
                            `El teléfono debe tener entre ${digitoMinimo} y ${digitoMaximo} dígitos para ${paisSeleccionado.nombre}`
                          );
                        }
                      }

                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input
                  placeholder={
                    paisSeleccionado
                      ? `${paisSeleccionado.digitoMinimo}-${paisSeleccionado.digitoMaximo} dígitos`
                      : ''
                  }
                  maxLength={paisSeleccionado?.digitoMaximo}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item
                label={<span>Correo<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="correo"
                rules={[{ required: true, message: 'El correo es requerido' }]}
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
                rules={[{ required: true, message: 'El área de trabajo es requerida' }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span>Industria<span style={{ color: '#ff4d4f' }}>*</span></span>}
                name="industria"
                rules={[{ required: true, message: 'La industria es requerida' }]}
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
