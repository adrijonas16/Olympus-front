// src/components/PrivateRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../utils/cookies';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const PrivateRoute = () => {
  const token = getCookie('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const payload = parseJwt(token);
  if (!payload || !payload.exp) {
    removeCookie('token');
    return <Navigate to="/login" replace />;
  }
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    removeCookie('token');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
