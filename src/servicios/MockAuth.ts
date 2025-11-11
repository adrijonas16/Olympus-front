// src/servicios/MockAuth.ts
// Simula la generación de un JWT con nombre, IP y expiración de 10 minutos

export async function obtenerIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch {
    return '0.0.0.0';
  }
}

function base64url(source: string) {
  // Encode in base64 and make it URL safe
  return btoa(source).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function generarTokenMock(nombre: string, password: string) {
  const ip = await obtenerIP();
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 600; // 10 minutos
  const payload = {
    nombre,
    ip,
    exp,
  };
  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  // La firma es simulada, no segura
  const signature = base64url('mock-signature');
  return `${headerB64}.${payloadB64}.${signature}`;
}
