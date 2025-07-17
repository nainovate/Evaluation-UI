'use client'

import React, { useState, useRef, useEffect } from 'react'
import { SelectOption } from '../../types'

interface SelectProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  options: SelectOption[]
  error?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
  id?: string
  name?: string
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  options,
  error,
  disabled = false,
  required = false,
  size = 'md',
  fullWidth = true,
  className = '',
  id,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const baseClasses = `
    border rounded-lg transition-all duration-200 cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
      : 'border-slate-300 dark:border-slate-600'
    }
    bg-white dark:bg-slate-800
    text-slate-900 dark:text-slate-100
  `

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get display value
  const selectedOption = options.find(option => option.value === value)
  const displayValue = selectedOption?.label || ''

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle option selection
  const handleOptionSelect = (optionValue: string) => {
    if (!disabled) {
      onChange?.(optionValue)
      setIsOpen(false)
      setSearchQuery('')
    }
  }

  // Handle dropdown toggle
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
  }

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`} ref={selectRef}>
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Select Button */}
        <button
          id={selectId}
          type="button"
          className={`
            ${baseClasses}
            ${sizeClasses[size]}
            ${fullWidth ? 'w-full' : ''}
            flex items-center justify-between
          `}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={displayValue ? '' : 'text-slate-400 dark:text-slate-500'}>
            {displayValue || placeholder}
          </span>
          <svg 
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            {options.length > 5 && (
              <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`
                      w-full px-4 py-3 text-left text-sm transition-colors duration-150
                      ${option.disabled 
                        ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                        : 'text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }
                      ${value === option.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''}
                    `}
                    onClick={() => !option.disabled && handleOptionSelect(option.value)}
                    disabled={option.disabled}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {value === option.value && (
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {option.disabled && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        Not available
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
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

export default Select