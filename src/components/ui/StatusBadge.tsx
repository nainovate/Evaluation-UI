'use client'

import React from 'react'
import { EvaluationStatus, TaskStatus } from '../../types'

interface StatusBadgeProps {
  status: EvaluationStatus | TaskStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showDot?: boolean
  animated?: boolean
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  showDot = false,
  animated = true,
  className = ''
}) => {
  // Status configurations
  const statusConfig = {
    completed: {
      label: 'Completed',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-200',
      borderColor: 'border-green-200 dark:border-green-700',
      icon: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      dotColor: 'bg-green-500'
    },
    'in-progress': {
      label: 'In Progress',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-800 dark:text-blue-200',
      borderColor: 'border-blue-200 dark:border-blue-700',
      icon: (
        <svg className="fill-current animate-spin" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v6a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 11.586V5z" />
        </svg>
      ),
      dotColor: 'bg-blue-500'
    },
    running: {
      label: 'Running',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-800 dark:text-blue-200',
      borderColor: 'border-blue-200 dark:border-blue-700',
      icon: (
        <svg className="fill-current animate-pulse" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      ),
      dotColor: 'bg-blue-500'
    },
    failed: {
      label: 'Failed',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-200',
      borderColor: 'border-red-200 dark:border-red-700',
      icon: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      dotColor: 'bg-red-500'
    },
    pending: {
      label: 'Pending',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      borderColor: 'border-yellow-200 dark:border-yellow-700',
      icon: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      dotColor: 'bg-yellow-500'
    }
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      iconSize: 'w-3 h-3',
      dotSize: 'w-2 h-2'
    },
    md: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      iconSize: 'w-4 h-4',
      dotSize: 'w-2.5 h-2.5'
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-base',
      iconSize: 'w-5 h-5',
      dotSize: 'w-3 h-3'
    }
  }

  const config = statusConfig[status]
  const sizeClasses = sizeConfig[size]

  if (!config) {
    console.warn(`Unknown status: ${status}`)
    return null
  }

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${config.bgColor} 
        ${config.textColor} 
        ${config.borderColor}
        ${sizeClasses.padding} 
        ${sizeClasses.text}
        ${animated ? 'status-badge transition-all duration-200' : ''}
        ${className}
      `}
    >
      {showDot && (
        <span
          className={`
            ${config.dotColor} 
            ${sizeClasses.dotSize} 
            rounded-full mr-2 
            ${status === 'in-progress' || status === 'running' ? 'animate-pulse' : ''}
          `}
        />
      )}
      
      {showIcon && !showDot && (
        <span className={`${sizeClasses.iconSize} mr-1.5`}>
          {config.icon}
        </span>
      )}
      
      <span>{config.label}</span>
    </span>
  )
}

// Utility function to get status color for other components
export const getStatusColor = (status: EvaluationStatus | TaskStatus): string => {
  const colorMap = {
    completed: 'green',
    'in-progress': 'blue',
    running: 'blue',
    failed: 'red',
    pending: 'yellow'
  }
  return colorMap[status] || 'gray'
}

// Utility function to check if status is active/loading
export const isStatusActive = (status: EvaluationStatus | TaskStatus): boolean => {
  return status === 'in-progress' || status === 'running'
}

// Utility function to check if status is successful
export const isStatusSuccess = (status: EvaluationStatus | TaskStatus): boolean => {
  return status === 'completed'
}

// Utility function to check if status is failed
export const isStatusFailed = (status: EvaluationStatus | TaskStatus): boolean => {
  return status === 'failed'
}

export default StatusBadge