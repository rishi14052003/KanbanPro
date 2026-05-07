import React from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  children: React.ReactNode
  padding?: CardPadding
  className?: string
}

const Card: React.FC<CardProps> = ({ children, padding = 'md', className = '' }) => {
  const paddingMap: Record<CardPadding, string> = {
    none: '0',
    sm: '16px',
    md: '22px',
    lg: '32px',
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #EDE8DF',
        boxShadow: '0 1px 4px rgba(44,31,20,0.05)',
        padding: paddingMap[padding],
      }}
      className={className}
    >
      {children}
    </div>
  )
}

export default Card
