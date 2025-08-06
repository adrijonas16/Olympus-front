// src/modelos/Login.ts

export class LoginDTO {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class LoginRespuestaDTO {
  token: string;
  refreshToken?: string;

  constructor(token: string, refreshToken?: string) {
    this.token = token;
    this.refreshToken = refreshToken;
  }
}
