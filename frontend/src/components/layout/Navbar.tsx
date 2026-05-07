import React, { useState } from 'react'
import { authService } from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Settings, Search } from 'lucide-react'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(3)
  const [searchFocused, setSearchFocused] = useState(false)

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <nav style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(254,252,248,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #EDE8DF',
      height: '73px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      gap: '16px',
    }}>

      {/* LEFT — Title */}
      <div style={{ flex: '0 0 auto', minWidth: 0 }}>
        <div style={{ fontSize: '19px', fontWeight: 700, color: '#1C1209', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Dashboard
        </div>
        <div style={{ fontSize: '11.5px', color: '#A0917E', fontWeight: 500, marginTop: '1px' }}>
          {today}
        </div>
      </div>

      {/* CENTER — Search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: searchFocused ? '#2C1F14' : '#A0917E',
              transition: 'color 0.15s ease',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              height: '40px',
              paddingLeft: '38px',
              paddingRight: '16px',
              background: searchFocused ? '#FFFFFF' : '#F3EDE3',
              border: `1.5px solid ${searchFocused ? '#C4A882' : 'transparent'}`,
              borderRadius: '10px',
              fontSize: '13.5px',
              color: '#1C1209',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              boxShadow: searchFocused ? '0 0 0 3px rgba(196,168,130,0.15)' : 'none',
            }}
          />
        </div>
      </div>

      {/* RIGHT — Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>

        {/* Notification Bell */}
        <button
          onClick={() => setNotifications(0)}
          style={{
            position: 'relative',
            width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#F3EDE3',
            border: '1.5px solid #EDE8DF',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#5C4E3E',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#EDE4D3'
            ;(e.currentTarget as HTMLElement).style.borderColor = '#D4C5AF'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#F3EDE3'
            ;(e.currentTarget as HTMLElement).style.borderColor = '#EDE8DF'
          }}
        >
          <Bell size={16} />
          {notifications > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              width: '18px', height: '18px',
              background: '#C0392B',
              borderRadius: '50%',
              fontSize: '10px', fontWeight: 700,
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #FEFCF8',
            }}>
              {notifications}
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          style={{
            width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#F3EDE3',
            border: '1.5px solid #EDE8DF',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#5C4E3E',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#EDE4D3'
            ;(e.currentTarget as HTMLElement).style.borderColor = '#D4C5AF'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#F3EDE3'
            ;(e.currentTarget as HTMLElement).style.borderColor = '#EDE8DF'
          }}
        >
          <Settings size={16} />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: '#EDE8DF', margin: '0 4px' }} />

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '0 16px',
            height: '40px',
            background: '#2C1F14',
            color: '#F5E6C8',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1C1209' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#2C1F14' }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </nav>
  )
}

export default Navbar