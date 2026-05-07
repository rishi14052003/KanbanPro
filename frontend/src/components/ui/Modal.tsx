import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const font = "'DM Sans', 'Helvetica Neue', sans-serif"

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }

    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .modal-overlay { animation: fadeIn 0.2s ease; }
        .modal-content { animation: slideUp 0.3s ease; }
      `}</style>
      <div
        className="modal-overlay"
        style={{
          position: 'fixed',
          inset: '0',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      >
        <div
          className="modal-content"
          style={{
            position: 'relative',
            background: '#FFFFFF',
            borderRadius: '18px',
            boxShadow: '0 20px 60px rgba(44,31,20,0.15)',
            maxWidth: '480px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #EDE8DF',
            fontFamily: font,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '22px 26px',
                borderBottom: '1px solid #EDE8DF',
              }}
            >
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#1C1209',
                  margin: 0,
                }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#A0917E',
                  transition: 'color 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#2C1F14')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#A0917E')}
              >
                <X size={20} />
              </button>
            </div>
          )}
          <div style={{ padding: '26px' }}>{children}</div>
        </div>
      </div>
    </>
  )
}

export default Modal
