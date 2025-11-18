// src/modelos/Login.ts

export class LoginDTO {
  correo: string;
  password: string;

  constructor(correo: string, password: string) {
    this.correo = correo;
    this.password = password;
  }
}

export class LoginRespuestaDTO {
  token: string;
  refreshToken?: string;
  mensaje: string | undefined;
  data: any;

  constructor(token: string, refreshToken?: string) {
    this.token = token;
    this.refreshToken = refreshToken;
  }
}
