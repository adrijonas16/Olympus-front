// Usuario
export const API_USUARIO_LOGIN = '/auth/login';
export const API_USUARIO_LOGOUT = '/auth/logout';
export const API_USUARIO_PERFIL = '/auth/perfil';

// Oportunidades
export const API_OPORTUNIDADES_LISTAR = '/oportunidades';
export const API_OPORTUNIDADES_DETALLE = (id: string | number) => `/oportunidades/${id}`;

// Otros
export const API_PRODUCTOS_LISTAR = '/productos';
