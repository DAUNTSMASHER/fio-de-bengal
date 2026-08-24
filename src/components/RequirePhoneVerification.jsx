import React from 'react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';

const RequirePhoneVerification = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const isPhoneVerified = user.publicMetadata?.phoneVerified === true;

  if (!isPhoneVerified) {
    // Redirect to verify-phone, and remember where they were trying to go
    return <Navigate to="/verify-phone" state={{ from: location }} replace />;
  }

  return children;
};

export default RequirePhoneVerification;
