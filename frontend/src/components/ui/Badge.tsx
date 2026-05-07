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
      style={{\n        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',\n        fontSize: '11px',\n        fontWeight: 700,\n        letterSpacing: '0.02em',\n        color: style.color,\n        background: style.background,\n        borderRadius: '7px',\n        padding: '3px 9px',\n        fontFamily: font,\n      }}\n    >\n      <span\n        style={{\n          width: '6px',\n          height: '6px',\n          borderRadius: '50%',\n          background: style.dot,\n          display: 'inline-block',\n          flexShrink: 0,\n        }}\n      />\n      {children}\n    </span>\n  )\n}\n\nexport default Badge\n