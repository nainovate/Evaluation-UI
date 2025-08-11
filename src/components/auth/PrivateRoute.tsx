// src/components/auth/PrivateRoute.tsx - Fixed version
'use client'

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { AUTH_CONFIG } from '../../lib/auth-config';

// Types
interface PrivateRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  showLoginPrompt?: boolean;
}

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  requireAuth?: boolean;
  onClick?: () => void;
}

// Loading spinner component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400">Loading...</p>
    </div>
  </div>
);

// Authentication required fallback component
const AuthRequired: React.FC<{ redirectTo?: string }> = ({ redirectTo }) => {
  const router = useRouter();
  
  const handleLoginRedirect = () => {
    if (redirectTo) {
      router.push(`${AUTH_CONFIG.LOGIN_PAGE}?redirect=${encodeURIComponent(redirectTo)}`);
    } else {
      router.push(AUTH_CONFIG.LOGIN_PAGE);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You need to sign in to access this page.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sign In
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Main PrivateRoute component
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  fallback,
  redirectTo 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  // If authentication is disabled, always render children
  if (!AUTH_CONFIG.ENABLED) {
    return <>{children}</>;
  }

  // Show loading while authentication state is being determined
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, show fallback or redirect
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return <AuthRequired redirectTo={redirectTo || pathname} />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

// Auth guard for specific features/components
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  requireAuth = true,
  showLoginPrompt = false
}) => {
  const { isAuthenticated, loading } = useAuth();

  // If authentication is disabled, always render children
  if (!AUTH_CONFIG.ENABLED) {
    return <>{children}</>;
  }

  // If auth is not required, always render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated
  if (!isAuthenticated) {
    // Show custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Show login prompt if requested
    if (showLoginPrompt) {
      return (
        <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
            Sign in to continue
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            This feature requires authentication.
          </p>
          <button
            onClick={() => window.location.href = AUTH_CONFIG.LOGIN_PAGE}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      );
    }

    // Don't render anything if not authenticated and no fallback
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

// Utility component for protected links
export const ProtectedLink: React.FC<ProtectedLinkProps> = ({ 
  href, 
  children, 
  className = '',
  requireAuth = true,
  onClick 
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If auth is disabled or not required, navigate normally
    if (!AUTH_CONFIG.ENABLED || !requireAuth) {
      if (onClick) onClick();
      router.push(href);
      return;
    }

    // If authenticated, navigate normally
    if (isAuthenticated) {
      if (onClick) onClick();
      router.push(href);
      return;
    }

    // Not authenticated, redirect to login with return URL
    router.push(`${AUTH_CONFIG.LOGIN_PAGE}?redirect=${encodeURIComponent(href)}`);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

// Hook for conditional rendering based on auth state
export const useAuthConditional = () => {
  const { isAuthenticated, user, loading } = useAuth();

  return {
    // Render content only when authenticated
    whenAuthenticated: (content: React.ReactNode) => 
      !AUTH_CONFIG.ENABLED || isAuthenticated ? content : null,
    
    // Render content only when not authenticated
    whenNotAuthenticated: (content: React.ReactNode) => 
      !AUTH_CONFIG.ENABLED || !isAuthenticated ? content : null,
    
    // Render different content based on auth state
    renderByAuthState: (authenticatedContent: React.ReactNode, unauthenticatedContent: React.ReactNode) => {
      if (!AUTH_CONFIG.ENABLED) {
        return unauthenticatedContent; // Treat as not authenticated when disabled
      }
      return isAuthenticated ? authenticatedContent : unauthenticatedContent;
    },
    
    // Check if feature should be available
    isFeatureAvailable: (requiresAuth: boolean = true) => 
      !AUTH_CONFIG.ENABLED || !requiresAuth || isAuthenticated,

    // Get current auth state
    authState: {
      isAuthenticated: AUTH_CONFIG.ENABLED ? isAuthenticated : false,
      user: AUTH_CONFIG.ENABLED ? user : null,
      loading: AUTH_CONFIG.ENABLED ? loading : false
    }
  };
};