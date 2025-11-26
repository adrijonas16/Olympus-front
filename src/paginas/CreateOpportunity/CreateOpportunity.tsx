import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Modal, message, Card, TimePicker, AutoComplete } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { insertarOportunidadHistorialRegistrado, obtenerLanzamientos, type ClientePotencial, type Lanzamiento } from '../../config/rutasApi';
import './CreateOpportunity.css';

const CreateOpportunity: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [lanzamientos, setLanzamientos] = useState<Lanzamiento[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loadingLanzamientos, setLoadingLanzamientos] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const client = (location.state as { client?: ClientePotencial })?.client;

  useEffect(() => {
    const cargarLanzamientos = async () => {
      try {
        setLoadingLanzamientos(true);
        const data = await obtenerLanzamientos();
        console.log('Lanzamientos obtenidos:', data);
        // Asegurar que siempre sea un array
        setLanzamientos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar lanzamientos:', error);
        message.error('Error al cargar los lanzamientos');
        setLanzamientos([]); // Establecer array vacío en caso de error
      } finally {
        setLoadingLanzamientos(false);
      }
    };

    cargarLanzamientos();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Obtener el IdPotencialCliente del cliente seleccionado
      const idPotencialCliente = client?.id || 0;

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

  // Filtrar lanzamientos basado en el texto de búsqueda
  const lanzamientosArray = Array.isArray(lanzamientos) ? lanzamientos : [];
  const filteredLanzamientos = searchText.trim() === ''
    ? lanzamientosArray
    : lanzamientosArray.filter(lanzamiento =>
        lanzamiento?.codigoLanzamiento?.toLowerCase().includes(searchText.toLowerCase())
      );

  const lanzamientoOptions = filteredLanzamientos.map(lanzamiento => ({
    value: lanzamiento.codigoLanzamiento,
    label: lanzamiento.codigoLanzamiento,
  }));

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

        {client && (
          <Card className="client-info-card">
            <div className="client-info-content">
              <h3 className="client-name">
                {client.persona.nombres} {client.persona.apellidos}
              </h3>
              <p className="client-phone">
                {client.persona.prefijoPaisCelular} {client.persona.celular}
              </p>
              <p className="client-email">{client.persona.correo}</p>
            </div>
            <div className="opportunities-badge">
              Información del Cliente Potencial
            </div>
          </Card>
        )}

        <Form
          form={form}
          layout="vertical"
          className="create-opportunity-form"
          requiredMark={false}
        >
          <Form.Item
            label={<span>Lanzamiento<span style={{ color: '#ff4d4f' }}>*</span></span>}
            name="lanzamiento"
            rules={[{ required: true, message: 'El campo Lanzamiento es requerido' }]}
          >
            <AutoComplete
              options={lanzamientoOptions}
              onSearch={setSearchText}
              value={searchText}
              placeholder="Buscar lanzamiento..."
              notFoundContent={loadingLanzamientos ? 'Cargando...' : 'No se encontraron lanzamientos'}
              filterOption={false}
              defaultActiveFirstOption={false}
              popupMatchSelectWidth={true}
              listHeight={300}
              onChange={(value) => {
                setSearchText(value);
                form.setFieldsValue({ lanzamiento: value });
              }}
              onSelect={(value) => {
                setSearchText(value);
                form.setFieldsValue({ lanzamiento: value });
              }}
            />
          </Form.Item>

          <div className="date-time-row">
            <Form.Item
              label={<span>Fecha<span style={{ color: '#ff4d4f' }}>*</span></span>}
              name="fecha"
              rules={[{ required: true, message: 'El campo Fecha es requerido' }]}
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
              rules={[{ required: true, message: 'El campo Hora es requerido' }]}
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
