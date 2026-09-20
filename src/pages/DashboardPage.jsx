import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileViewerModal from '../components/ProfileViewerModal'
import FIRInbox from '../components/sho/FIRInbox'
import SHODashboardHome from '../components/sho/SHODashboardHome'
import SHOSidebar from '../components/sho/SHOSidebar'
import SHOTopbar from '../components/sho/SHOTopbar'
import '../styles/sho-dashboard.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('dems_active_user')
      if (stored) return JSON.parse(stored)
    } catch (err) {
      console.warn('LocalStorage parse error:', err)
    }
    return {
      username: 'sho_rajesh',
      name: 'Rajesh Kumar Sharma',
      email: 'sho.central@police.gov.in',
      pno: 'DL-481902',
      orgId: 'police',
      orgName: 'Police Department',
      roleId: 'police_sho',
      roleName: 'Station House Officer (SHO)',
      cadre: 'Supervisory Station In-Charge',
      station: 'Central Police Station, Division I',
    }
  })

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')

  const handleLogout = () => {
    localStorage.removeItem('dems_active_user')
    navigate('/')
  }

  return (
    <div className="sho-dashboard-page-root">
      <SHOTopbar
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />
      <div className="sho-dashboard-body">
        <SHOSidebar
          currentUser={currentUser}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
        <main className="sho-dashboard-content">
          {activeSection === 'dashboard' ? (
            <SHODashboardHome currentUser={currentUser} onNavigate={setActiveSection} />
          ) : activeSection === 'fir-inbox' ? (
            <FIRInbox currentUser={currentUser} onBack={() => setActiveSection('dashboard')} />
          ) : (
            <section className="sho-placeholder-panel" aria-labelledby="coming-next-title">
              <span className="sho-placeholder-mark" aria-hidden="true">DEMS</span>
              <p className="sho-eyebrow">Workspace section</p>
              <h1 id="coming-next-title">Coming next</h1>
              <p>This workspace is being prepared for the next dashboard phase.</p>
            </section>
          )}
        </main>
      </div>

      <ProfileViewerModal
        isOpen={isProfileModalOpen}
        currentUser={currentUser}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateUser={(updated) => setCurrentUser(updated)}
      />
    </div>
  )
}
