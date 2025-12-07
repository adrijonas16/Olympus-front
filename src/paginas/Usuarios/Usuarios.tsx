import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  Spin,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import { obtenerPaises } from "../../config/rutasApi";
import { getCookie } from "../../utils/cookies";
import { validarAccesoRuta } from "../../componentes/ValidarAccesoRuta";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

interface Pais {
  id: number;
  nombre: string;
  prefijoCelularPais: number;
  digitoMinimo: number;
  digitoMaximo: number;
  estado?: boolean;
}

interface Rol {
  id: number;
  nombreRol: string;
  estado: boolean;
}

interface Usuario {
  id: number;
  idPersona: number;
  nombreUsuario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  idPais: number | null;
  celular: string;
  industria: string | null;
  areaTrabajo: string | null;
  idRol: number | null;
  rol: string;
  activo: boolean;
}

const INDUSTRIAS = [
  "Tecnología",
  "Minería",
  "Educación",
  "Salud",
  "Construcción",
  "Retail",
  "Servicios",
];
const AREAS = [
  "Operaciones",
  "Marketing",
  "Ventas",
  "TI",
  "Recursos Humanos",
  "Logística",
  "Administración",
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPaises, setLoadingPaises] = useState(false);
  const [paisSeleccionado, setPaisSeleccionado] = useState<Pais | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [accesoDenegado, setAccesoDenegado] = useState(false);

useEffect(() => {
  const acceso = validarAccesoRuta("/usuarios/usuarios", navigate);

  if (!acceso.permitido) {
    setAccesoDenegado(true);
    setLoading(false);       // 🔥 DETIENE SPINNER
    setLoadingPaises(false); // 🔥 DETIENE SPINNER
    message.error(acceso.error);
    return;
  }

  cargarPaises();
  cargarRoles();
  cargarUsuarios();
}, []);


  const cargarPaises = async () => {
    try {
      setLoadingPaises(true);
      const paisesData = await obtenerPaises();
      const paisesActivos = paisesData.filter((p: Pais) => p.estado);
      setPaises(paisesActivos);

      const peru = paisesActivos.find((p) => p.nombre === "Perú");
      if (peru) {
        setPaisSeleccionado(peru);
        form.setFieldsValue({ idPais: peru.id });
      }
    } catch {
      message.error("Error al cargar países");
    } finally {
      setLoadingPaises(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const token = getCookie("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/CFGModUsuarios/ListarRoles`,
        {
          method: "GET",
          headers: { accept: "*/*", Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return message.error("No se pudieron obtener los roles");
      const data = await res.json();
      setRoles(Array.isArray(data.rol) ? data.rol : []);
    } catch {
      message.error("Error al cargar roles");
    }
  };

  const cargarUsuarios = async () => {
    try {
      const token = getCookie("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/CFGModUsuarios/ListarConUsuario`,
        {
          method: "GET",
          headers: { accept: "*/*", Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        message.error("No se pudo obtener usuarios");
        setLoading(false);
        return;
      }
      const data = await res.json();
      const listado = (data.usuarios || []).map((u: any) => ({
        id: u.idUsuario,
        idPersona: u.idPersona,
        nombreUsuario: u.nombreUsuario ?? u.nombre ?? "",
        nombres: u.nombres ?? "",
        apellidos: u.apellidos ?? "",
        correo: u.correo ?? "",
        idPais: u.idPais ?? null,
        celular: u.celular ?? "",
        industria: u.industria ?? "",
        areaTrabajo: u.areaTrabajo ?? "",
        idRol: u.idRol ?? null,
        rol: u.rol ?? "",
        activo: u.activo ?? true,
      }));
      setUsuarios(listado);
    } catch (err) {
      console.log(err);
      message.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setEditando(null);
    form.resetFields();
    if (paisSeleccionado) form.setFieldsValue({ idPais: paisSeleccionado.id });
    setModalVisible(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setEditando(usuario);
    form.setFieldsValue({
      nombreUsuario: usuario.nombreUsuario,
      correoUsuario: usuario.correo,
      password: "",
      idRol: usuario.idRol,
      idPais: usuario.idPais,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      celular: usuario.celular,
      industria: usuario.industria,
      areaTrabajo: usuario.areaTrabajo,
    });
    setModalVisible(true);
  };

  const guardarUsuario = async () => {
    try {
      const values = await form.validateFields();
      const token = getCookie("token");

      let url = `${
        import.meta.env.VITE_API_URL
      }/api/CFGModUsuarios/RegistrarUsuarioYPersona`;
      let method: "POST" | "PUT" = "POST";

      if (editando) {
        url = `${
          import.meta.env.VITE_API_URL
        }/api/CFGModUsuarios/EditarUsuarioYPersona/${editando.id}`;
        method = "PUT";
      }

      // Si password está vacío en edición, no enviarlo
      if (editando && !values.password) delete values.password;

      const res = await fetch(url, {
        method,
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (data.codigo !== 0)
        return message.error(
          data.mensaje || "Error al registrar/editar usuario"
        );

      message.success(
        editando
          ? "Usuario editado correctamente"
          : "Usuario registrado correctamente"
      );
      setModalVisible(false);
      form.resetFields();
      cargarUsuarios();
    } catch (err) {
      console.log(err);
      message.error("Error al guardar usuario");
    }
  };

  const eliminarUsuario = async (idUsuario: number) => {
    try {
      const token = getCookie("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/CFGModUsuarios/EliminarUsuarioYPersona/${idUsuario}`,
        {
          method: "DELETE",
          headers: { accept: "*/*", Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.codigo !== 0)
        return message.error(data.mensaje || "Error al eliminar usuario");
      message.success("Usuario eliminado correctamente");
      cargarUsuarios();
    } catch (err) {
      console.log(err);
      message.error("Error al eliminar usuario");
    }
  };

  const columnas = [
    { title: "Nombres", dataIndex: "nombres" },
    { title: "Apellidos", dataIndex: "apellidos" },
    { title: "Correo", dataIndex: "correo" },
    { title: "Rol", dataIndex: "rol" },
    {
      title: "Estado",
      dataIndex: "activo",
      render: (a: boolean) =>
        a ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>,
    },
    {
      title: "Acciones",
      render: (_: any, row: Usuario) => (
        <Space>
          <Button type="link" onClick={() => abrirModalEditar(row)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que quieres eliminar este usuario?"
            onConfirm={() => eliminarUsuario(row.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger type="link">
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

    if (accesoDenegado) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2 style={{ color: "red" }}>
          🚫 No tienes permiso para ver esta sección
        </h2>
        <p>Consulta con un administrador si crees que se trata de un error.</p>
      </div>
    );
  }


  if (loading || loadingPaises) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", padding: 20 }}>
      <Button type="primary" onClick={abrirModalNuevo}>
        Nuevo usuario
      </Button>
      <Table
        columns={columnas}
        dataSource={usuarios}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        open={modalVisible}
        title={editando ? "Editar usuario" : "Nuevo usuario"}
        onCancel={() => setModalVisible(false)}
        onOk={guardarUsuario}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre de usuario"
            name="nombreUsuario"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nombres"
            name="nombres"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Apellidos"
            name="apellidos"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Correo"
            name="correoUsuario"
            rules={[
              { required: true, message: "Ingresa un correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input />
          </Form.Item>
          {!editando && (
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item label="Rol" name="idRol" rules={[{ required: true }]}>
            <Select placeholder="Seleccione rol">
              {roles.map((r) => (
                <Option key={r.id} value={r.id}>
                  {r.nombreRol}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="País" name="idPais">
            <Select allowClear placeholder="Seleccione">
              {paises.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.nombre} (+{p.prefijoCelularPais})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Celular" name="celular">
            <Input />
          </Form.Item>
          <Form.Item label="Industria" name="industria">
            <Select allowClear placeholder="Seleccione">
              {INDUSTRIAS.map((x) => (
                <Option key={x} value={x}>
                  {x}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Área de trabajo" name="areaTrabajo">
            <Select allowClear placeholder="Seleccione">
              {AREAS.map((x) => (
                <Option key={x} value={x}>
                  {x}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
