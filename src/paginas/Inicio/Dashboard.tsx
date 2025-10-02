
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto', textAlign: 'center', background: '#f7f7f7', borderRadius: 12 }}>
      <h1 style={{ color: '#2c3e50' }}>Bienvenido al Dashboard</h1>
      <p>Esta es una ruta protegida. Tu sesión se cerrará automáticamente si el token expira o se elimina.</p>
      <button
        onClick={handleLogout}
        style={{ marginTop: 24, padding: '0.5rem 1.5rem', fontSize: 18, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
