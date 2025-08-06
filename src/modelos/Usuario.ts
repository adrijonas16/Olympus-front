export class PerfilUsuarioDTO {
  id: string;
  nombre: string;
  correo: string;
  rol: string;

  constructor(
    id: string,
    nombre: string,
    correo: string,
    rol: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.rol = rol;
  }
}
