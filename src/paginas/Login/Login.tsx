import { useLogin } from '../../hooks/useLogin';
import estilos from './Login.module.css';

function LoginPage() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    error,
    cargando,
    manejarLogin
  } = useLogin();

  return (
    <form className={estilos.formulario} onSubmit={manejarLogin}>
      <input
        className={estilos.input}
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={estilos.input}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={estilos.boton} type="submit" disabled={cargando}>
        {cargando ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
      {error && <p className={estilos.error}>{error}</p>}
    </form>
  );
}

export default LoginPage;
 