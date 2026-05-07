import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'skeleton'
  className?: string
  message?: string
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  className = '',
  message,
}) => {
  const font = "'DM Sans', 'Helvetica Neue', sans-serif"

  const sizeMap = {
    sm: { spinner: 32, icon: 14 },
    md: { spinner: 56, icon: 26 },
    lg: { spinner: 80, icon: 38 },
  }

  const dimensions = sizeMap[size]

  if (variant === 'spinner') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: font,
        }}
        className={className}
      >
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loader-spinner {
            animation: spin 0.8s linear infinite;
          }
        `}</style>
        <div
          style={{
            width: `${dimensions.spinner}px`,
            height: `${dimensions.spinner}px`,
            background: '#F3EDE3',
            borderRadius: size === 'sm' ? '10px' : size === 'md' ? '16px' : '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="loader-spinner"
            style={{
              width: `${dimensions.icon}px`,
              height: `${dimensions.icon}px`,
              borderRadius: '50%',
              border: `3px solid rgba(123,99,72,0.2)`,
              borderTopColor: '#7C6348',
            }}
          />
        </div>
        {message && (
          <>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2C1F14',
                margin: 0,
              }}
            >
              {message}
            </p>
            <p
              style={{
                fontSize: '12px',
                color: '#A0917E',
                margin: '0 0 0 0',
              }}
            >
              Just a moment
            </p>
          </>
        )}
      </div>
    )
  }

  // Skeleton variant
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      className={className}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .skeleton {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          background: linear-gradient(90deg, #F3EDE3, #FFFFFF, #F3EDE3);
          background-size: 200% 100%;
        }
      `}</style>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px',
            borderRadius: '8px',
            width: i === 1 ? '80%' : i === 2 ? '100%' : '60%',
          }}
        />
      ))}
    </div>
  )
}

export default Loader