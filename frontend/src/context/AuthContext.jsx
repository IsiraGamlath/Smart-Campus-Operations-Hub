import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCurrentUser() {
      try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          signal: controller.signal,
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const userData = await response.json();
        const isValidUser =
          userData && typeof userData === 'object' && !Array.isArray(userData) && typeof userData.email === 'string';

        setUser(isValidUser ? userData : null);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setUser(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      controller.abort();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
