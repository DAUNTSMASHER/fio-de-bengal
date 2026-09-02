import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const { user, isLoaded, setSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoaded && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSession(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper texture-bengal-wave">
      <div className="auth-card">
        <div className="auth-header">
          <img src="/design_assets/fio_generated_tiger_logo.png" alt="Fio de Bengal" className="auth-logo" />
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Welcome back to Fio de Bengal. Access your exclusive wholesale dashboard.</p>
        </div>

        {error && <div className="auth-error-msg">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="auth-form-group">
            <div className="auth-label-wrapper">
              <label className="auth-label">Password</label>
              <Link to="/reset-password" className="auth-link">Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link" style={{ fontWeight: '600' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
