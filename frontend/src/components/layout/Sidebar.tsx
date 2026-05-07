import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  User,
  Settings,
  BarChart3,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { authService } from '../../services/authService'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const user = authService.getUser()
    if (user) setUserData(user)
  }, [])

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks',     label: 'Tasks',     icon: CheckSquare },
    { path: '/teams',     label: 'Teams',     icon: Users },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/profile',   label: 'Profile',   icon: User },
    { path: '/settings',  label: 'Settings',  icon: Settings },
  ]

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: '#FEFCF8',
        borderRight: '1px solid #EDE8DF',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '256px',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
      }}
    >
      {/* ── Logo ── */}
      <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid #EDE8DF' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px',
            background: 'linear-gradient(145deg, #2C1F14, #4A3728)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(44,31,20,0.25)',
            flexShrink: 0,
          }}>
            <Sparkles size={18} color="#F5E6C8" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1C1209', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              TaskForge
            </div>
            <div style={{ fontSize: '11px', color: '#A0917E', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '1px' }}>
              Workspace
            </div>
          </div>
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#B8A898', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px' }}>
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                marginBottom: '2px',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FEFCF8' : '#5C4E3E',
                background: isActive
                  ? 'linear-gradient(135deg, #2C1F14, #4A3728)'
                  : 'transparent',
                boxShadow: isActive ? '0 2px 8px rgba(44,31,20,0.2)' : 'none',
                transition: 'all 0.15s ease',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = '#F3EDE3'
                  ;(e.currentTarget as HTMLElement).style.color = '#2C1F14'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = '#5C4E3E'
                }
              }}
            >
              <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* ── User Card ── */}
      <div style={{ padding: '12px', borderTop: '1px solid #EDE8DF' }}>
        <div style={{
          background: '#F6F0E6',
          borderRadius: '14px',
          padding: '14px',
          border: '1px solid #EDE8DF',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '38px', height: '38px',
              background: 'linear-gradient(135deg, #2C1F14, #4A3728)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#F5E6C8',
              flexShrink: 0,
            }}>
              {userData?.name ? getInitials(userData.name) : 'U'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1209', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userData?.name || 'User'}
              </div>
              <div style={{ fontSize: '11px', color: '#9E8E7C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userData?.email || 'user@email.com'}
              </div>
            </div>
          </div>
          <button
            onClick={() => { authService.logout(); window.location.href = '/login' }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '7px', padding: '9px', borderRadius: '9px',
              background: '#2C1F14', color: '#F5E6C8',
              border: 'none', cursor: 'pointer',
              fontSize: '12.5px', fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1C1209' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#2C1F14' }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar