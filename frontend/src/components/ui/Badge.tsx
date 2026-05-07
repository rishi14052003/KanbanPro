import React from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => {
  const font = "'DM Sans', 'Helvetica Neue', sans-serif"

  const variants: Record<BadgeVariant, { background: string; color: string; dot: string }> = {
    success: {
      background: '#D1FAE5',
      color: '#14532D',
      dot: '#10B981',
    },
    warning: {
      background: '#FEF3C7',
      color: '#92600A',
      dot: '#F59E0B',
    },
    danger: {
      background: '#FEE2E2',
      color: '#7F1D1D',
      dot: '#DC2626',
    },
    info: {
      background: '#F3EDE3',
      color: '#5C3D2E',
      dot: '#7C6348',
    },
  }

  const style = variants[variant]

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.02em',
        color: style.color,
        background: style.background,
        borderRadius: '7px',
        padding: '3px 9px',
        fontFamily: font,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: style.dot,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  )
}

export default Badge