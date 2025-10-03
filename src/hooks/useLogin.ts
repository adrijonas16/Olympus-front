import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginDTO } from '../modelos/Login';
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
      // Obtener IP pública
      const resIp = await fetch('https://api.ipify.org?format=json');
      const dataIp = await resIp.json();
      const ip = dataIp.ip;

      // Llamar al backend
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/SegModLogin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password, ip }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      const token = data.token;
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
