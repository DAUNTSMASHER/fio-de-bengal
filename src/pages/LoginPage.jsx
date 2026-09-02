import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, login, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if already logged in
  if (isLoaded && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const handleSuccess = (credentialResponse) => {
    login(credentialResponse);
    navigate('/dashboard'); // AuthContext/Router will handle redirect to /admin if admin
  };

  const handleError = () => {
    console.error('Google Login Failed');
    alert("Login failed. Please try again.");
  };

  return (
    <div className="page-layout texture-bengal-wave" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="login-card" style={{ background: 'var(--surface-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 12px 24px rgba(0,0,0,0.06)', border: '1px solid var(--border-muted)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <img src="/design_assets/Logo.png" alt="Fio de Bengal" style={{ height: '60px', marginBottom: '24px' }} />
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Sign In</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Welcome back to Fio de Bengal. Please sign in to access your dashboard.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            shape="rectangular"
            theme="outline"
            text="signin_with"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
