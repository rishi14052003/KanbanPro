import React, { ImgHTMLAttributes } from 'react'
import { User } from 'lucide-react'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  name?: string
  size?: AvatarSize
  showInitials?: boolean
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>((
  { src, name = '', size = 'md', showInitials = true, ...props },
  ref
) => {
  const sizeMap: Record<AvatarSize, { container: number; text: string; icon: number }> = {
    xs: { container: 28, text: '10px', icon: 12 },
    sm: { container: 36, text: '12px', icon: 16 },
    md: { container: 44, text: '14px', icon: 20 },
    lg: { container: 56, text: '16px', icon: 24 },
    xl: { container: 72, text: '20px', icon: 32 },
  }

  const dims = sizeMap[size]
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')

  // Generate consistent color from name
  const colors = [
    { bg: '#F3EDE3', color: '#7C6348' },
    { bg: '#FEF3C7', color: '#92600A' },
    { bg: '#FED7AA', color: '#9A3412' },
    { bg: '#D1FAE5', color: '#14532D' },
    { bg: '#FEE2E2', color: '#7F1D1D' },
  ]
  const colorIndex = (name.length + name.charCodeAt(0)) % colors.length
  const colorScheme = colors[colorIndex]

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {src ? (
        <img
          ref={ref}
          src={src}
          alt={name}
          style={{
            width: `${dims.container}px`,
            height: `${dims.container}px`,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #FFFFFF',
            boxShadow: '0 2px 8px rgba(44,31,20,0.1)',
          }}
          {...props}
        />
      ) : name && showInitials ? (
        <div
          style={{
            width: `${dims.container}px`,
            height: `${dims.container}px`,
            borderRadius: '50%',
            background: colorScheme.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: dims.text,
            fontWeight: 700,
            color: colorScheme.color,
            border: '2px solid #FFFFFF',
            boxShadow: '0 2px 8px rgba(44,31,20,0.1)',
            fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          }}
        >
          {initials}
        </div>
      ) : (
        <div
          style={{
            width: `${dims.container}px`,
            height: `${dims.container}px`,
            borderRadius: '50%',
            background: '#F3EDE3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #FFFFFF',
            boxShadow: '0 2px 8px rgba(44,31,20,0.1)',
          }}
        >
          <User size={dims.icon} color="#A0917E" />
        </div>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'

export default Avatar