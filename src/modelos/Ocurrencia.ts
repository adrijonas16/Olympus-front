export interface OcurrenciaDTO {
  id: number;
  nombre: string;
  idEstado?: number | null;
  allowed: boolean;
}