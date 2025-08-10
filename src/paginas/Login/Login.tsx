import { useLogin } from '../../hooks/useLogin';
import estilos from './Login.module.css';

function LoginPage() {
  const {
    correo,
    password,
    setCorreo,
    setPassword,
    error,
    cargando,
    manejarLogin
  } = useLogin();

  return (
    <div className={estilos.contenedorLogin}>
      <form className={estilos.formulario} onSubmit={manejarLogin}>
        <input
          className={estilos.input}
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          className={estilos.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={estilos.boton} type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
        {error && <p className={estilos.error}>{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
