'use client'

import React from 'react'

interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'number' | 'search'
  error?: string
  disabled?: boolean
  required?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
  id?: string
  name?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = true,
  className = '',
  id,
  name
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }

  const baseClasses = `
    border rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
      : 'border-slate-300 dark:border-slate-600'
    }
    bg-white dark:bg-slate-800
    text-slate-900 dark:text-slate-100
    placeholder-slate-400 dark:placeholder-slate-500
  `

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`${iconSizes[size]} text-slate-400 dark:text-slate-500`}>
              {icon}
            </span>
          </div>
        )}
        
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            ${baseClasses}
            ${sizeClasses[size]}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${fullWidth ? 'w-full' : ''}
          `}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={`${iconSizes[size]} text-slate-400 dark:text-slate-500`}>
              {icon}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input