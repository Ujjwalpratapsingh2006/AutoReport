import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  // We start in a loading state while we attempt a silent refresh on initial mount
  const [isLoading, setIsLoading] = useState(true);

  // Silent refresh on mount
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/refresh-tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Critical: ensures the HTTP-only refreshToken cookie is sent
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setAccessToken(data.accessToken);
        }
      } catch (error) {
        console.error('Silent refresh failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    silentRefresh();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      // Best-effort logout API call to revoke the refresh token in the database
      // and clear the secure cookie.
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
