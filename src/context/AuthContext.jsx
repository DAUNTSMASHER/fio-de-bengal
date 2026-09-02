import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Hardcoded Admins (Replace with real admin emails)
const ADMIN_EMAILS = [
  'admin@fiodebengal.com',
  'fiodebengal@gmail.com',
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const token = localStorage.getItem('google_jwt_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Check if token is expired
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem('google_jwt_token');
          setUser(null);
        } else {
          // Determine Role
          const role = ADMIN_EMAILS.includes(decoded.email) ? 'admin' : 'buyer';
          
          setUser({
            id: decoded.sub,
            name: decoded.name || 'User',
            email: decoded.email,
            role: role,
            picture: decoded.picture,
            token: token // Keep token for API calls
          });
        }
      } catch (err) {
        console.error("Invalid token in localStorage", err);
        localStorage.removeItem('google_jwt_token');
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (credentialResponse) => {
    const token = credentialResponse.credential;
    localStorage.setItem('google_jwt_token', token);
    
    const decoded = jwtDecode(token);
    const role = ADMIN_EMAILS.includes(decoded.email) ? 'admin' : 'buyer';
    
    setUser({
      id: decoded.sub,
      name: decoded.name || 'User',
      email: decoded.email,
      role: role,
      picture: decoded.picture,
      token: token
    });
  };

  const logout = () => {
    localStorage.removeItem('google_jwt_token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
