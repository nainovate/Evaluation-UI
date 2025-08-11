// src/lib/auth-config.ts
export const AUTH_CONFIG = {
  // 🔥 MAIN TOGGLE - Set to false to completely disable authentication
  ENABLED: false,
  
  // Route protection settings
  PROTECT_EVALUATION: true,
  PROTECT_DASHBOARD: true,
  
  // API settings
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  LOGIN_ENDPOINT: '/api/login',
  LOGOUT_ENDPOINT: '/api/logout',
  NEW_ACCESS_TOKEN_ENDPOINT: '/api/newAccessToken',
  
  // Token settings
  ACCESS_TOKEN_KEY: 'evaluation_access_token',
  REFRESH_TOKEN_KEY: 'evaluation_refresh_token',
  USER_DATA_KEY: 'evaluation_user_data',
  SESSION_ID_KEY: 'evaluation_session_id',
  DEVICE_HASH_KEY: 'evaluation_device_hash',
  
  // Redirect settings
  DEFAULT_REDIRECT_AFTER_LOGIN: '/evaluation/start',
  LOGIN_PAGE: '/auth/login'
};

// src/types/auth.ts
export interface User {
  userId: string;
  userName: string;
  email: string;
  role: string[];
  org?: string;
  position?: string;
  deviceHash: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  deviceHash: string;
  sessionId: string;
}

export interface LoginResponse {
  status_code: number;
  message?: string;
  userName?: string;
  email?: string;
  userId?: string;
  refreshToken?: string;
  accessToken?: string;
  deviceHash?: string;
  role?: string[];
  org?: string;
  position?: string;
  detail?: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
}

// Utility types for components
export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

// Device fingerprinting utility
export const generateDeviceHash = (): string => {
  // Create a simple device fingerprint
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
};

// Session ID generator
export const generateSessionId = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Storage utilities with error handling
export const storage = {
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
    }
    return null;
  },
  
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
};

// Auth API utilities
export const authApi = {
  login: async (loginData: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}${AUTH_CONFIG.LOGIN_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  logout: async (sessionId: string, deviceHash: string): Promise<void> => {
    await fetch(`${AUTH_CONFIG.API_BASE_URL}${AUTH_CONFIG.LOGOUT_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        deviceHash,
      }),
    });
  },
  
  refreshAccessToken: async (sessionId: string, deviceHash: string): Promise<any> => {
    const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}${AUTH_CONFIG.NEW_ACCESS_TOKEN_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        data: { deviceHash },
      }),
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    return response.json();
  }
};

// Validation utilities
export const validateLoginForm = (username: string, password: string): string | null => {
  if (!username.trim()) {
    return 'Username is required';
  }
  
  if (!password.trim()) {
    return 'Password is required';
  }
  
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  return null;
};