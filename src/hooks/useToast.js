// src/hooks/useToast.js

import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((
    message, 
    type = 'info',
    duration
  ) => {
    // Check if a toast with the same message and type already exists
    const existingToast = toasts.find(toast => 
      toast.message === message && toast.type === type
    );
    
    // If duplicate exists, return the existing toast's id without creating a new one
    if (existingToast) {
      return existingToast.id;
    }
    
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, [toasts]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, duration) => 
    addToast(message, 'success', duration), [addToast]);
  
  const showError = useCallback((message, duration) => 
    addToast(message, 'error', duration), [addToast]);
  
  const showWarning = useCallback((message, duration) => 
    addToast(message, 'warning', duration), [addToast]);
  
  const showInfo = useCallback((message, duration) => 
    addToast(message, 'info', duration), [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};