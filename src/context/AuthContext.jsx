import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthProvider as DescopeAuthProvider, useUser, useDescope } from '@descope/react-sdk';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Custom wrapper around Descope's context to maintain compatibility with the rest of the app
const CustomAuthProvider = ({ children }) => {
  const { user: descopeUser, isUserLoading } = useUser();
  const { logout: descopeLogout } = useDescope();
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (descopeUser) {
      // Map Descope user to our app's user structure
      const roles = descopeUser.roleNames || [];
      const role = roles.includes('Admin') || roles.includes('admin') ? 'admin' : 'buyer';
      
      setUser({
        id: descopeUser.userId,
        name: descopeUser.name || 'User',
        email: descopeUser.email,
        role: role,
        // In a real app we might pass the session token here if needed by Axios/fetch
        isPhoneVerified: descopeUser.customAttributes?.isPhoneVerified === true,
      });
    } else {
      setUser(null);
    }
  }, [descopeUser]);

  const login = async (email, password) => {
    // For Descope, login is handled by the UI component (<Descope />)
    // This stub is left here in case old code calls it, but shouldn't be used
    console.warn('Login should be handled by the Descope UI component');
  };

  const logout = async () => {
    await descopeLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  const projectId = import.meta.env.VITE_DESCOPE_PROJECT_ID || "REPLACE_WITH_DESCOPE_PROJECT_ID";
  return (
    <DescopeAuthProvider projectId={projectId}>
      <CustomAuthProvider>
        {children}
      </CustomAuthProvider>
    </DescopeAuthProvider>
  );
};
