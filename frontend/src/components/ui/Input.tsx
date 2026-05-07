import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((
  { label, error, icon, placeholder, type = 'text', ...props },
  ref
) => {
  const font = "'DM Sans', 'Helvetica Neue', sans-serif"

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#2C1F14',
            marginBottom: '8px',
            fontFamily: font,
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#A0917E',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          style={{
            width: '100%',
            paddingLeft: icon ? '42px' : '14px',
            paddingRight: '14px',
            paddingTop: '11px',
            paddingBottom: '11px',
            borderRadius: '11px',
            border: error ? '1.5px solid #DC2626' : '1.5px solid #DDD0BB',
            background: '#FFFFFF',
            color: '#2C1F14',
            fontSize: '13.5px',
            fontFamily: font,
            fontWeight: 500,
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 3px rgba(44,31,20,0.05)',
            outline: 'none',
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = error ? '#DC2626' : '#2C1F14'
            (e.target as HTMLInputElement).style.boxShadow = error
              ? '0 0 0 3px rgba(220,38,38,0.1)'
              : '0 0 0 3px rgba(44,31,20,0.08)'
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = error ? '#DC2626' : '#DDD0BB'
            (e.target as HTMLInputElement).style.boxShadow = '0 1px 3px rgba(44,31,20,0.05)'
          }}
          {...props}
        />
      </div>
      {error && (
        <p
          style={{
            marginTop: '6px',
            fontSize: '12px',
            color: '#DC2626',
            fontFamily: font,
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
