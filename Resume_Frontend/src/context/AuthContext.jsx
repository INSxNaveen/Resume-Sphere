import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate auth state from local storage on startup
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Normalize: if backend says FullName, ensure we have consistency
        const normalized = {
          ...parsedUser,
          name: parsedUser.name || parsedUser.fullName || parsedUser.FullName || 'User'
        };
        setUser(normalized);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to parse stored auth state", err);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData, token) => {
    // Normalize user data before storing
    const normalized = {
      ...userData,
      name: userData.name || userData.fullName || userData.FullName || 'User'
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalized));
    setUser(normalized);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
