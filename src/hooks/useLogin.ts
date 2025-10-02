import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginDTO } from '../modelos/Login';
// import { iniciarSesion } from '../servicios/AutenticacionServicio';
import { generarTokenMock } from '../servicios/MockAuth';
import { MENSAJES_ERROR } from '../config/constantes';

export const useLogin = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarLogin = async (evento: React.FormEvent) => {
        console.log('URL base del API:', import.meta.env.VITE_API_URL); // <-- aquí

    evento.preventDefault();
    setCargando(true);
    setError('');

    try {
      // const dto = new LoginDTO(correo, password);
      // const { token } = await iniciarSesion(dto);

      // Usar el mock para generar el token
      const token = await generarTokenMock(correo, password);
      document.cookie = `token=${token}; path=/; secure; samesite=strict;`;
      navigate('/dashboard');
    } catch {
      setError(MENSAJES_ERROR.LOGIN_INCORRECTO);
    } finally {
      setCargando(false);
    }
  };

  return {
    correo,
    password,
    setCorreo,
    setPassword,
    error,
    cargando,
    manejarLogin
  };
};
