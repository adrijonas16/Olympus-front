import React, { useState } from 'react';
import { Modal, Input, Button, Card } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './SelectClient.css';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  opportunities: number;
}

interface SelectClientProps {
  visible?: boolean;
  onClose?: () => void;
  onSelectClient?: (client: Client) => void;
  onCreateNewClient?: () => void;
}

const SelectClient: React.FC<SelectClientProps> = ({
  visible = true,
  onClose,
  onSelectClient,
  onCreateNewClient
}) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleSelectClient = (client: Client) => {
    if (onSelectClient) {
      onSelectClient(client);
    } else {
      console.log('Cliente seleccionado:', client);
      // Lógica por defecto
    }
  };

  const handleCreateNewClient = () => {
    if (onCreateNewClient) {
      onCreateNewClient();
    } else {
      navigate('/leads/CreateClient');
    }
  };

  // Datos de ejemplo - reemplazar con datos reales
  const clients: Client[] = [
    {
      id: '1',
      name: 'Juan Francisco Obando',
      phone: '+51 9800 9374 2069',
      email: 'juan_obg@gmail.com',
      opportunities: 3
    },
    // Agregar m�s clientes seg�n sea necesario
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchText.toLowerCase()) ||
    client.phone.includes(searchText) ||
    client.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      closeIcon={<CloseOutlined />}
      className="select-client-modal"
      width={900}
    >
      <div className="select-client-container">
        <h2 className="select-client-title">Seleccionar Cliente</h2>

        <Input
          placeholder="Buscar cliente por nombre completo..."
          prefix={<SearchOutlined className="search-icon" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="select-client-search"
        />

        <div className="client-list">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="client-card"
              onClick={() => handleSelectClient(client)}
              hoverable
            >
              <div className="client-info">
                <h3 className="client-name">{client.name}</h3>
                <p className="client-detail">{client.phone}</p>
                <p className="client-detail">{client.email}</p>
              </div>
              <div className="client-opportunities">
                Oportunidades relacionadas: {client.opportunities}
              </div>
            </Card>
          ))}

          {filteredClients.length === 0 && (
            <div className="no-results">
              No se encontraron clientes
            </div>
          )}
        </div>

        <Button
          type="primary"
          block
          icon={<span className="plus-icon">+</span>}
          onClick={handleCreateNewClient}
          className="create-new-client-button"
        >
          Crear nuevo cliente
        </Button>
      </div>
    </Modal>
  );
};

export default SelectClient;
