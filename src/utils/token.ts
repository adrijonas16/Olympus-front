const STORAGE_KEY = "auth_token";

export function setToken(token: string) {
  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  const exp = payload.exp as number;
  const now = Math.floor(Date.now() / 1000);
  return now >= exp;
}

export function isTokenValid(token?: string | null) {
  return !!token && !isTokenExpired(token);
}
