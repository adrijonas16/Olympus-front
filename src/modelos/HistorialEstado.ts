export interface HistorialDto {
  id: number;
  idOportunidad: number;
  idAsesor?: number | null;
  idEstado?: number | null;
  idOcurrencia?: number | null;
  observaciones: string;
  fechaCreacion: Date;
  usuarioCreacion: string;
}