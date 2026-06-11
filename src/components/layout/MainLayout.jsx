import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AmbientBackground from './AmbientBackground'
import MobileMenu from './MobileMenu'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import UtilityModal from './UtilityModal'

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [utilityModal, setUtilityModal] = useState('')

  return (
    <div className="min-h-screen bg-slate-950/30 text-slate-100">
      <AmbientBackground />

      <div className="relative flex min-h-screen">
        <Sidebar onHelp={() => setUtilityModal('help')} onSettings={() => setUtilityModal('settings')} />
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onHelp={() => setUtilityModal('help')}
          onSettings={() => setUtilityModal('settings')}
        />

        <div className="min-w-0 flex-1">
          <Navbar onMenuClick={() => setMenuOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <UtilityModal type={utilityModal} onClose={() => setUtilityModal('')} />
    </div>
  )
}

export default MainLayout
