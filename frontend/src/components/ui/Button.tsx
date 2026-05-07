import React, { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', loading = false, disabled, ...props }, ref) => {
    const font = "'DM Sans', 'Helvetica Neue', sans-serif"

    const variants: Record<ButtonVariant, { background: string; color: string; hover: string }> = {
      primary: {
        background: '#2C1F14',
        color: '#F5E6C8',
        hover: '#1C1209',
      },
      secondary: {
        background: '#F3EDE3',
        color: '#2C1F14',
        hover: '#E8DED0',
      },
      danger: {
        background: '#DC2626',
        color: '#FFFFFF',
        hover: '#B91C1C',
      },
    }

    const style = variants[variant]

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '11px 20px',
          background: style.background,
          color: style.color,
          border: 'none',
          borderRadius: '11px',
          fontSize: '13.5px',
          fontWeight: 600,
          fontFamily: font,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
          opacity: disabled || loading ? 0.6 : 1,
          boxShadow: variant === 'primary' ? '0 4px 14px rgba(44,31,20,0.15)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            ;(e.currentTarget as HTMLElement).style.background = style.hover
            if (variant === 'primary') {
              const transform = 'translateY(-2px)'
              const boxShadow = '0 6px 20px rgba(44,31,20,0.25)'
              ;(e.currentTarget as HTMLElement).style.transform = transform
              ;(e.currentTarget as HTMLElement).style.boxShadow = boxShadow
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            ;(e.currentTarget as HTMLElement).style.background = style.background
            if (variant === 'primary') {
              const transform = 'translateY(0)'
              const boxShadow = '0 4px 14px rgba(44,31,20,0.15)'
              ;(e.currentTarget as HTMLElement).style.transform = transform
              ;(e.currentTarget as HTMLElement).style.boxShadow = boxShadow
            }
          }
        }}
        {...props}
      >
        {loading ? (
          <>
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: `2px solid ${variant === 'primary' ? 'rgba(245,230,200,0.3)' : 'rgba(44,31,20,0.3)'}`,
                borderTopColor: variant === 'primary' ? '#F5E6C8' : '#2C1F14',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
