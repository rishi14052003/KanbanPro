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
    return (\n      <div\n        style={{\n          display: 'flex',\n          flexDirection: 'column',\n          alignItems: 'center',\n          justifyContent: 'center',\n          gap: '16px',\n          fontFamily: font,\n        }}\n        className={className}\n      >\n        <style>{`\n          @keyframes spin {\n            to { transform: rotate(360deg); }\n          }\n          .loader-spinner {\n            animation: spin 0.8s linear infinite;\n          }\n        `}</style>\n        <div\n          style={{\n            width: `${dimensions.spinner}px`,\n            height: `${dimensions.spinner}px`,\n            background: '#F3EDE3',\n            borderRadius: size === 'sm' ? '10px' : size === 'md' ? '16px' : '20px',\n            display: 'flex',\n            alignItems: 'center',\n            justifyContent: 'center',\n          }}\n        >\n          <div\n            className=\"loader-spinner\"\n            style={{\n              width: `${dimensions.icon}px`,\n              height: `${dimensions.icon}px`,\n              borderRadius: '50%',\n              border: `3px solid rgba(123,99,72,0.2)`,\n              borderTopColor: '#7C6348',\n            }}\n          />\n        </div>\n        {message && (\n          <>\n            <p\n              style={{\n                fontSize: '14px',\n                fontWeight: 600,\n                color: '#2C1F14',\n                margin: 0,\n              }}\n            >\n              {message}\n            </p>\n            <p\n              style={{\n                fontSize: '12px',\n                color: '#A0917E',\n                margin: '0 0 0 0',\n              }}\n            >\n              Just a moment\n            </p>\n          </>\n        )}\n      </div>\n    )\n  }\n\n  // Skeleton variant\n  return (\n    <div\n      style={{\n        display: 'flex',\n        flexDirection: 'column',\n        gap: '16px',\n      }}\n      className={className}\n    >\n      <style>{`\n        @keyframes pulse {\n          0%, 100% { opacity: 1; }\n          50% { opacity: 0.5; }\n        }\n        .skeleton {\n          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n          background: linear-gradient(90deg, #F3EDE3, #FFFFFF, #F3EDE3);\n          background-size: 200% 100%;\n        }\n      `}</style>\n      {[1, 2, 3].map((i) => (\n        <div\n          key={i}\n          className=\"skeleton\"\n          style={{\n            height: size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px',\n            borderRadius: '8px',\n            width: i === 1 ? '80%' : i === 2 ? '100%' : '60%',\n          }}\n        />\n      ))}\n    </div>\n  )\n}\n\nexport default Loader\n