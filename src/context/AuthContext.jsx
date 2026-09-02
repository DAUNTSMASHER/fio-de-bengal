import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const token = localStorage.getItem('fio_session_token');
    const storedUser = localStorage.getItem('fio_user_data');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token });
      } catch (err) {
        console.error("Invalid session data in localStorage", err);
        localStorage.removeItem('fio_session_token');
        localStorage.removeItem('fio_user_data');
      }
    }
    setIsLoaded(true);
  }, []);

  const setSession = (token, userData) => {
    localStorage.setItem('fio_session_token', token);
    localStorage.setItem('fio_user_data', JSON.stringify(userData));
    setUser({ ...userData, token });
  };

  const logout = async () => {
    // Optionally call backend to destroy session token in D1
    if (user?.token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
      } catch (err) {
        console.error("Logout API failed", err);
      }
    }

    localStorage.removeItem('fio_session_token');
    localStorage.removeItem('fio_user_data');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
