import type { OcurrenciaDTO } from "../modelos/Ocurrencia";
import api, { baseUrl } from "../servicios/api";

// Usuario
export const API_USUARIO_LOGIN = 'api/SegModLogin/login';
export const API_USUARIO_LOGOUT = 'api/auth/logout';
export const API_USUARIO_PERFIL = 'api/auth/perfil';

// Oportunidades
export const API_OPORTUNIDADES_LISTAR = '/oportunidades';
export const API_OPORTUNIDADES_DETALLE = (id: string | number) => `/oportunidades/${id}`;

// Otros
export async function getOcurrenciasPermitidas(oportunidadId: number): Promise<OcurrenciaDTO[]> {
  const res = await api.get(`/api/VTAModVentaHistorialEstado/${oportunidadId}/ocurrenciasDisponibles`);
  return res.data?.ocurrencias ?? res.data ?? [];
}

export async function crearHistorialConOcurrencia(oportunidadId: number, ocurrenciaId: number, usuario = "SYSTEM") {
  try {
    const res = await api.post(
      `/api/VTAModVentaHistorialEstado/${oportunidadId}/crearConOcurrencia`,
      { ocurrenciaId, usuario }
    );
    return res.data;
  } catch (err: any) {
    console.error("crearHistorialConOcurrencia axios error", err?.response?.status, err?.response?.data);
    throw err;
  }
}

export default baseUrl;
