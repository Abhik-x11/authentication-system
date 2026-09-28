import React, { createContext, useState, useEffect } from 'react';
import { createSimulatedJWT, decodeSimulatedJWT, isTokenExpired } from '../utils/jwtHelper';

const AUTH_TOKEN_KEY = 'taskflow_jwt_token_v2';
const REMEMBERED_USER_KEY = 'taskflow_remembered_username_v2';
const STORAGE_TYPE_KEY = 'taskflow_storage_type_v2';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initial check: inspect localStorage or sessionStorage
  const [authState, setAuthState] = useState(() => {
    try {
      const storageType = localStorage.getItem(STORAGE_TYPE_KEY);
      let token = null;

      if (storageType === 'local') {
        token = localStorage.getItem(AUTH_TOKEN_KEY);
      } else if (storageType === 'session') {
        token = sessionStorage.getItem(AUTH_TOKEN_KEY);
      } else {
        // Fallback check
        token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
      }

      if (token && !isTokenExpired(token)) {
        const decoded = decodeSimulatedJWT(token);
        if (decoded && decoded.payload) {
          return {
            isAuthenticated: true,
            user: {
              id: decoded.payload.id,
              username: decoded.payload.username,
              name: decoded.payload.name,
              email: decoded.payload.email,
              role: decoded.payload.role
            },
            token,
            rememberUser: !!decoded.payload.rememberUser,
            storageType: decoded.payload.rememberUser ? 'localStorage' : 'sessionStorage'
          };
        }
      }
    } catch (err) {
      console.error('Error restoring auth session:', err);
    }

    return {
      isAuthenticated: false,
      user: null,
      token: null,
      rememberUser: false,
      storageType: null
    };
  });

  const [isJwtModalOpen, setIsJwtModalOpen] = useState(false);
  const [rememberedUsername, setRememberedUsername] = useState(() => {
    try {
      return localStorage.getItem(REMEMBERED_USER_KEY) || '';
    } catch {
      return '';
    }
  });

  // Keep state synchronized
  useEffect(() => {
    if (authState.isAuthenticated && authState.token) {
      if (authState.rememberUser) {
        localStorage.setItem(AUTH_TOKEN_KEY, authState.token);
        localStorage.setItem(STORAGE_TYPE_KEY, 'local');
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
      } else {
        sessionStorage.setItem(AUTH_TOKEN_KEY, authState.token);
        localStorage.setItem(STORAGE_TYPE_KEY, 'session');
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(STORAGE_TYPE_KEY);
    }
  }, [authState]);

  /**
   * Login handler
   * Fulfills: Login, Remember User, JWT Token Simulation, Local Storage
   */
  const login = (username, password, rememberUser = false) => {
    const cleanUsername = username.trim();
    const displayName = cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);
    
    // Assign role based on username or default
    const role = cleanUsername.toLowerCase().includes('admin') 
      ? 'System Administrator' 
      : 'Senior Project Lead';

    const userProfile = {
      id: `usr_${Date.now()}`,
      username: cleanUsername,
      name: displayName,
      email: `${cleanUsername.toLowerCase()}@taskflow.dev`,
      role
    };

    // Generate simulated JWT token
    const token = createSimulatedJWT(userProfile, rememberUser);

    // Handle Remember User preference
    if (rememberUser) {
      localStorage.setItem(REMEMBERED_USER_KEY, cleanUsername);
      setRememberedUsername(cleanUsername);
    } else {
      localStorage.removeItem(REMEMBERED_USER_KEY);
      setRememberedUsername('');
    }

    setAuthState({
      isAuthenticated: true,
      user: userProfile,
      token,
      rememberUser,
      storageType: rememberUser ? 'localStorage' : 'sessionStorage'
    });

    return { success: true, token, user: userProfile };
  };

  /**
   * Logout handler
   * Fulfills: Logout, storage cleanup, session invalidation
   */
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(STORAGE_TYPE_KEY);

    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      rememberUser: false,
      storageType: null
    });
  };

  const openJwtModal = () => setIsJwtModalOpen(true);
  const closeJwtModal = () => setIsJwtModalOpen(false);

  const value = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    token: authState.token,
    rememberUser: authState.rememberUser,
    storageType: authState.storageType,
    rememberedUsername,
    isJwtModalOpen,
    openJwtModal,
    closeJwtModal,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
