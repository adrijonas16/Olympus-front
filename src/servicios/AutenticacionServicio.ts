import api from './api';
import {
  API_USUARIO_LOGIN,
  API_USUARIO_LOGOUT,
  API_USUARIO_PERFIL
} from '../config/rutasApi';

import {
  LoginDTO,
  LoginRespuestaDTO
} from '../modelos/Login';

import { PerfilUsuarioDTO } from '../modelos/Usuario';

/**
 * Inicia sesión del usuario con su email y contraseña.
 * Mapea `email` a `username` porque el backend lo requiere.
 */
export const iniciarSesion = async (datos: LoginDTO): Promise<LoginRespuestaDTO> => {
  const respuesta = await api.post(API_USUARIO_LOGIN, {
    correo: datos.correo,
    password: datos.password
  });

  return respuesta.data;
};

/**
 * Cierra la sesión del usuario.
 */
export const cerrarSesion = async (): Promise<void> => {
  await api.post(API_USUARIO_LOGOUT);
};

/**
 * Obtiene el perfil del usuario autenticado.
 */
export const obtenerPerfilUsuario = async (): Promise<PerfilUsuarioDTO> => {
  const respuesta = await api.get(API_USUARIO_PERFIL);
  return respuesta.data;
};
