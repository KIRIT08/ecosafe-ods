import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AudioProvider from './components/audio/AudioProvider.jsx'
import AuthProvider from './components/auth/AuthProvider.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'
import './styles/leaflet.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
