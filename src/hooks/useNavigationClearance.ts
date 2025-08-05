// src/hooks/useNavigationClearance.ts
import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface UseNavigationClearanceOptions {
  clearFunction: (reason?: string) => void;
  enableAutoClearing?: boolean;
  clearOnRoutes?: string[];
  preserveOnRoutes?: string[];
}

interface UseNavigationClearanceReturn {
  clearOnNavigation: (targetRoute: string) => void;
  clearOnUnload: () => void;
}

export const useNavigationClearance = ({
  clearFunction,
  enableAutoClearing = true,
  clearOnRoutes = ['/dashboard', '/results', '/settings', '/profile', '/'],
  preserveOnRoutes = ['/evaluation/']
}: UseNavigationClearanceOptions): UseNavigationClearanceReturn => {
  
  const pathname = usePathname();

  // Manual clearing method for specific routes
  const clearOnNavigation = useCallback((targetRoute: string) => {
    const shouldClear = clearOnRoutes.some(route => targetRoute.includes(route));
    const shouldPreserve = preserveOnRoutes.some(route => targetRoute.includes(route));
    
    if (shouldClear && !shouldPreserve) {
      clearFunction(`navigate_to_${targetRoute}`);
    }
  }, [clearFunction, clearOnRoutes, preserveOnRoutes]);

  // Clear on page unload
  const clearOnUnload = useCallback(() => {
    clearFunction('page_unload');
  }, [clearFunction]);

  // Auto-clearing based on pathname changes
  useEffect(() => {
    if (!enableAutoClearing) return;

    // Check if current route should trigger clearing
    const shouldClear = clearOnRoutes.some(route => pathname.startsWith(route));
    const shouldPreserve = preserveOnRoutes.some(route => pathname.includes(route));
    
    // Clear if we're on a clearing route and not on a preserve route
    if (shouldClear && !shouldPreserve) {
      clearFunction(`auto_clear_on_${pathname}`);
    }
  }, [pathname, clearFunction, enableAutoClearing, clearOnRoutes, preserveOnRoutes]);

  // Handle browser events
  useEffect(() => {
    // Clear on page unload (browser close, tab close, etc.)
    const handleBeforeUnload = () => {
      // Only clear if not in evaluation flow
      if (!pathname.includes('/evaluation/')) {
        clearFunction('browser_unload');
      }
    };

    // Clear on browser back/forward navigation away from evaluation
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const shouldClear = clearOnRoutes.some(route => currentPath.includes(route));
      const shouldPreserve = preserveOnRoutes.some(route => currentPath.includes(route));
      
      if (shouldClear && !shouldPreserve) {
        clearFunction(`popstate_to_${currentPath}`);
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, clearFunction, clearOnRoutes, preserveOnRoutes]);

  // Component unmount clearing
  useEffect(() => {
    return () => {
      // Clear on component unmount if navigating away from evaluation flow
      const currentPath = window.location.pathname;
      const isLeavingEvaluation = !currentPath.includes('/evaluation/');
      
      if (isLeavingEvaluation) {
        clearFunction('component_unmount_external');
      }
    };
  }, [clearFunction]);

  return {
    clearOnNavigation,
    clearOnUnload
  };
};

// Additional utility hook for components that need manual control
export const useManualNavigationClearance = (clearFunction: (reason?: string) => void) => {
  const clearAndNavigate = useCallback((router: any, path: string) => {
    // Clear before navigation
    clearFunction(`manual_navigate_to_${path}`);
    
    // Small delay to ensure localStorage is cleared
    setTimeout(() => {
      router.push(path);
    }, 50);
  }, [clearFunction]);

  return { clearAndNavigate };
};

// Smart clearing logic utility
export const shouldClearOnNavigation = (fromPath: string, toPath: string): boolean => {
  // Don't clear if staying within evaluation flow
  if (fromPath.includes('/evaluation/') && toPath.includes('/evaluation/')) {
    return false;
  }
  
  // Clear if leaving evaluation flow
  if (fromPath.includes('/evaluation/') && !toPath.includes('/evaluation/')) {
    return true;
  }
  
  // Clear if entering dashboard from anywhere
  if (toPath.includes('/dashboard')) {
    return true;
  }
  
  // Clear if going to home page
  if (toPath === '/') {
    return true;
  }
  
  return false;
};