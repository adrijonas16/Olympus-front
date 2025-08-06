import { useState } from 'react';
import { LoginDTO } from '../modelos/Login';
import { iniciarSesion } from '../servicios/AutenticacionServicio';
import { MENSAJES_ERROR } from '../config/constantes';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setCargando(true);
    setError('');

    try {
      const dto = new LoginDTO(email, password);
      const { token } = await iniciarSesion(dto);
      document.cookie = `token=${token}; path=/; secure; samesite=strict`;
    } catch {
      setError(MENSAJES_ERROR.LOGIN_INCORRECTO);
    } finally {
      setCargando(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    error,
    cargando,
    manejarLogin
  };
};
