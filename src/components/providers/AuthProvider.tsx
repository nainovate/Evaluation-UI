// src/components/providers/AuthProvider.tsx
'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  AuthState, 
  AuthContextType, 
  User, 
  AuthTokens,
  LoginResponse 
} from '../../lib/auth-config';
import { 
  AUTH_CONFIG, 
  storage, 
  authApi, 
  generateDeviceHash, 
  generateSessionId,
  validateLoginForm 
} from '../../lib/auth-config';

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Action types for reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESH_SUCCESS'; payload: AuthTokens }
  | { type: 'INITIALIZE_AUTH'; payload: { user: User; tokens: AuthTokens } | null };

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        error: null,
        loading: false,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: action.payload,
        loading: false,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        loading: false,
      };
    
    case 'TOKEN_REFRESH_SUCCESS':
      return {
        ...state,
        tokens: action.payload,
        error: null,
      };
    
    case 'INITIALIZE_AUTH':
      if (!action.payload) {
        return { ...initialState, loading: false };
      }
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        loading: false,
      };
    
    default:
      return state;
  }
};

// AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication from stored tokens
  const initializeAuth = async () => {
    try {
      // If auth is disabled, skip initialization
      if (!AUTH_CONFIG.ENABLED) {
        dispatch({ type: 'INITIALIZE_AUTH', payload: null });
        return;
      }

      const storedUser = storage.getItem(AUTH_CONFIG.USER_DATA_KEY);
      const storedAccessToken = storage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      const storedRefreshToken = storage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);

      if (storedUser && storedAccessToken && storedRefreshToken) {
        const user: User = JSON.parse(storedUser);
        const tokens: AuthTokens = {
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
        };

        dispatch({ 
          type: 'INITIALIZE_AUTH', 
          payload: { user, tokens } 
        });

        // Optionally validate token with server
        // await validateToken();
      } else {
        dispatch({ type: 'INITIALIZE_AUTH', payload: null });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      dispatch({ type: 'INITIALIZE_AUTH', payload: null });
    }
  };

  // Login function
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // If auth is disabled, return error - login shouldn't be called
      if (!AUTH_CONFIG.ENABLED) {
        return { success: false, error: 'Authentication is disabled' };
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Validate form data
      const validationError = validateLoginForm(username, password);
      if (validationError) {
        dispatch({ type: 'LOGIN_FAILURE', payload: validationError });
        return { success: false, error: validationError };
      }

      // Generate device hash and session ID
      const deviceHash = generateDeviceHash();
      const sessionId = generateSessionId();

      // Store session ID and device hash
      storage.setItem(AUTH_CONFIG.SESSION_ID_KEY, sessionId);
      storage.setItem(AUTH_CONFIG.DEVICE_HASH_KEY, deviceHash);

      // Make login API call
      const response: LoginResponse = await authApi.login({
        username,
        password,
        deviceHash,
        sessionId,
      });

      if (response.status_code === 200) {
        const user: User = {
          userId: response.userId!,
          userName: response.userName!,
          email: response.email!,
          role: response.role!,
          org: response.org,
          position: response.position,
          deviceHash: response.deviceHash!,
        };

        const tokens: AuthTokens = {
          accessToken: response.accessToken!,
          refreshToken: response.refreshToken!,
        };

        // Store auth data
        storage.setItem(AUTH_CONFIG.USER_DATA_KEY, JSON.stringify(user));
        storage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, tokens.accessToken);
        storage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, tokens.refreshToken);

        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user, tokens } 
        });

        return { success: true };
      } else {
        const error = response.detail || 'Login failed';
        dispatch({ type: 'LOGIN_FAILURE', payload: error });
        return { success: false, error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      if (AUTH_CONFIG.ENABLED) {
        const sessionId = storage.getItem(AUTH_CONFIG.SESSION_ID_KEY);
        const deviceHash = storage.getItem(AUTH_CONFIG.DEVICE_HASH_KEY);

        if (sessionId && deviceHash) {
          try {
            await authApi.logout(sessionId, deviceHash);
          } catch (error) {
            console.warn('Logout API call failed:', error);
          }
        }
      }

      // Clear all stored auth data
      storage.removeItem(AUTH_CONFIG.USER_DATA_KEY);
      storage.removeItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      storage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      storage.removeItem(AUTH_CONFIG.SESSION_ID_KEY);
      storage.removeItem(AUTH_CONFIG.DEVICE_HASH_KEY);

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local data even if server logout fails
      storage.clear();
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!AUTH_CONFIG.ENABLED) {
        return true; // Always succeed when auth is disabled
      }

      const sessionId = storage.getItem(AUTH_CONFIG.SESSION_ID_KEY);
      const deviceHash = storage.getItem(AUTH_CONFIG.DEVICE_HASH_KEY);

      if (!sessionId || !deviceHash) {
        await logout();
        return false;
      }

      const response = await authApi.refreshAccessToken(sessionId, deviceHash);

      if (response.status === 200 && response.accessToken) {
        const newTokens: AuthTokens = {
          accessToken: response.accessToken,
          refreshToken: state.tokens?.refreshToken || '',
        };

        storage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, response.accessToken);
        dispatch({ type: 'TOKEN_REFRESH_SUCCESS', payload: newTokens });
        
        return true;
      } else {
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      return false;
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for authentication
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { isAuthenticated, loading } = useAuth();
    
    // If auth is disabled, always render component
    if (!AUTH_CONFIG.ENABLED) {
      return <Component {...props} />;
    }
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please log in to access this page.
            </p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};