import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="page-layout texture-marble-venation">
      <div className="container login-container">
        <div className="login-box">
          <h1 className="page-title">Sign In</h1>
          <p className="login-subtitle">Access your FIO DE BENGAL account.</p>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn btn-primary login-btn">Sign In</button>
          </form>
          <div className="login-hint">
            <p><strong>Demo Access:</strong></p>
            <p>Admin: admin@fiodebengal.com</p>
            <p>Buyer: buyer@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
