import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAF7F2',
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      <Sidebar />

      <div style={{ marginLeft: '256px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <main style={{ flex: 1, padding: '32px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {children}
          </div>
        </main>

        <footer style={{
          borderTop: '1px solid #EDE8DF',
          background: '#FEFCF8',
          padding: '18px 32px',
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12.5px',
            color: '#A0917E',
            fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          }}>
            <p>© 2026 TaskForge. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy', 'Terms', 'Support'].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    color: '#A0917E',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#2C1F14' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#A0917E' }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default DashboardLayout