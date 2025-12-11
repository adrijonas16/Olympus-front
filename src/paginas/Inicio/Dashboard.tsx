import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  // const [datos, setDatos] = useState<any>(null);
  // const [error, setError] = useState('');
  // const [cargando, setCargando] = useState(true);

  function handleLogout() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  }

  // useEffect(() => {
  //   async function fetchDatos() {
  //     setCargando(true);
  //     setError('');
  //     try {
  //       const token = getCookie('token');
  //       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/CFGModPermisos/ObtenerTodas`, {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': token || '',
  //         },
  //       });
  //       if (res.status === 401) {
  //         // Borra el token y cierra sesión si el backend responde 401
  //         document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  //         navigate('/login');
  //         return;
  //       }
  //       // Renovar token si el header está presente
  //       const tokenRenovado = res.headers.get('X-Token-Renewed');
  //       if (tokenRenovado) {
  //         document.cookie = `token=${tokenRenovado}; path=/; secure; samesite=strict;`;
  //       }
  //       const data = await res.json();
  //       setDatos(data);
  //     } catch (e) {
  //       setError('Error al obtener datos');
  //     } finally {
  //       setCargando(false);
  //     }
  //   }
  //   fetchDatos();
  // }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto', textAlign: 'center', background: '#f7f7f7', borderRadius: 12 }}>
      {/* <h1 style={{ color: '#2c3e50' }}>Bienvenido al Dashboard</h1>
      <p>Esta es una ruta protegida. Tu sesión se cerrará automáticamente si el token expira o se elimina.</p>
      <button
        onClick={handleLogout}
        style={{ marginTop: 24, padding: '0.5rem 1.5rem', fontSize: 18, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        Cerrar sesión
      </button>
      <div style={{ marginTop: 32 }}>
        {cargando && <p>Cargando datos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {datos && (
          <pre style={{ textAlign: 'left', background: '#fff', padding: 16, borderRadius: 8, marginTop: 16 }}>
            {JSON.stringify(datos, null, 2)}
          </pre>
        )}
      </div>
      <h1 style={{ color: '#2c3e50' }}>Bienvenido al Dashboard</h1>
      <p>Esta es una ruta protegida. Tu sesión se cerrará automáticamente si el token expira o se elimina.</p>
      <button
        onClick={handleLogout}
        style={{ marginTop: 24, padding: '0.5rem 1.5rem', fontSize: 18, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        Cerrar sesión
      </button>
      <div style={{ marginTop: 32 }}>
        {cargando && <p>Cargando datos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {datos && (
          <pre style={{ textAlign: 'left', background: '#fff', padding: 16, borderRadius: 8, marginTop: 16 }}>
            {JSON.stringify(datos, null, 2)}
          </pre>
        )}
      </div>
      <h1 style={{ color: '#2c3e50' }}>Bienvenido al Dashboard</h1>
      <p>Esta es una ruta protegida. Tu sesión se cerrará automáticamente si el token expira o se elimina.</p>
      <button
        onClick={handleLogout}
        style={{ marginTop: 24, padding: '0.5rem 1.5rem', fontSize: 18, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        Cerrar sesión
      </button>
      <div style={{ marginTop: 32 }}>
        {cargando && <p>Cargando datos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {datos && (
          <pre style={{ textAlign: 'left', background: '#fff', padding: 16, borderRadius: 8, marginTop: 16 }}>
            {JSON.stringify(datos, null, 2)}
          </pre>
        )}
      </div>
      <h1 style={{ color: '#2c3e50' }}>Bienvenido al Dashboard</h1>
      <p>Esta es una ruta protegida. Tu sesión se cerrará automáticamente si el token expira o se elimina.</p>
      <button
        onClick={handleLogout}
        style={{ marginTop: 24, padding: '0.5rem 1.5rem', fontSize: 18, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        Cerrar sesión
      </button>
      <div style={{ marginTop: 32 }}>
        {cargando && <p>Cargando datos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {datos && (
          <pre style={{ textAlign: 'left', background: '#fff', padding: 16, borderRadius: 8, marginTop: 16 }}>
            {JSON.stringify(datos, null, 2)}
          </pre>
        )}
      </div> */}
    </div>
  );
}
