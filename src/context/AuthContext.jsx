import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (clerkUser) {
      // Map Clerk user to our app's user structure
      const role = clerkUser.publicMetadata?.role === 'admin' ? 'admin' : 'buyer';
      
      setUser({
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        email: clerkUser.primaryEmailAddress?.emailAddress,
        role: role,
        isPhoneVerified: clerkUser.publicMetadata?.isPhoneVerified === true,
      });
    } else {
      setUser(null);
    }
  }, [clerkUser]);

  const login = async () => {
    console.warn('Login is handled by Clerk UI components');
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isUserLoading: !isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};
