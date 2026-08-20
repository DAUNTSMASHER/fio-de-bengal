import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fio-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('fio-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fio-user');
    }
  }, [user]);

  const login = async (email, password) => {
    // In a real app, this calls /api/auth/login
    // For now, we mock the auth based on email to demo the panels
    if (email === 'admin@fiodebengal.com') {
      const adminUser = { id: 1, name: 'Admin User', email, role: 'admin', token: 'mock-jwt-token-admin' };
      setUser(adminUser);
      return adminUser;
    } else {
      const buyerUser = { id: 2, name: 'Valued Customer', email, role: 'buyer', token: 'mock-jwt-token-buyer' };
      setUser(buyerUser);
      return buyerUser;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
