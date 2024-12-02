'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_COOKIE_NAME } from './config';

const AuthContext = createContext({});

export function useSession() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (session) {
          setData(session);
          setStatus('authenticated');
        } else {
          setData(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        setStatus('unauthenticated');
      }
    }

    loadSession();
  }, []);

  return (
    <AuthContext.Provider value={{ data, status }}>
      {children}
    </AuthContext.Provider>
  );
} 