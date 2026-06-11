import {
  BarChart3,
  BookOpen,
  FileText,
  Gamepad2,
  Home,
  MapPin,
  User,
} from 'lucide-react'

export const appRoutes = [
  {
    path: '/inicio',
    label: 'Inicio',
    icon: Home,
    description: 'Bienvenida, progreso y accesos principales.',
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    description: 'Indicadores ODS y graficos.',
  },
  {
    path: '/mapa-riesgos',
    label: 'Mapa de Riesgos',
    icon: MapPin,
    description: 'Zonas ambientales monitoreadas.',
  },
  {
    path: '/videojuego',
    label: 'Videojuego',
    icon: Gamepad2,
    description: 'EcoGuard ODS en Canvas.',
  },
  {
    path: '/biblioteca',
    label: 'Biblioteca ODS',
    icon: BookOpen,
    description: 'Contenido educativo por ODS.',
  },
  {
    path: '/perfil',
    label: 'Perfil',
    icon: User,
    description: 'Puntos, insignias y actividad.',
  },
  {
    path: '/reportes',
    label: 'Reportes ODS',
    icon: FileText,
    description: 'Impacto y recomendaciones simuladas.',
  },
]
