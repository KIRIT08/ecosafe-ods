import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Biblioteca from '../pages/Biblioteca'
import Dashboard from '../pages/Dashboard'
import Inicio from '../pages/Inicio'
import Login from '../pages/Login'
import MapaRiesgos from '../pages/MapaRiesgos'
import Perfil from '../pages/Perfil'
import Register from '../pages/Register'
import Reportes from '../pages/Reportes'
import Videojuego from '../pages/Videojuego'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mapa-riesgos" element={<MapaRiesgos />} />
        <Route path="/videojuego" element={<Videojuego />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/reportes" element={<Reportes />} />
      </Route>
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}

export default AppRoutes
