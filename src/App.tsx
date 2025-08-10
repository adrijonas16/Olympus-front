import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './paginas/Login/Login'
import Dashboard from './paginas/Inicio/Dashboard' // crea este componente o usa uno temporal
import { PrivateRoute } from './componentes/PrivateRoute' // como te di antes

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Redirige la raíz a login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
