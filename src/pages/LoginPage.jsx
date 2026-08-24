import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Descope } from '@descope/react-sdk';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const onSuccess = (e) => {
    // Descope returns user info in the event payload
    // We can extract roles to determine where to navigate
    const user = e.detail.user;
    const roles = user.roleNames || [];
    
    if (roles.includes('Admin') || roles.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const onError = (e) => {
    console.error('Descope login error:', e);
  };

  return (
    <div className="page-layout texture-marble-venation">
      <div className="container login-container" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <div className="login-box" style={{ maxWidth: '500px', width: '100%', padding: '0', background: 'transparent', boxShadow: 'none' }}>
          {/* We assume the default flow ID is 'sign-up-or-in' which you will configure in Descope Console */}
          <Descope
            flowId="sign-up-or-in"
            onSuccess={onSuccess}
            onError={onError}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
