// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../utils/cookies';

export const PrivateRoute = () => {
  const token = getCookie('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
