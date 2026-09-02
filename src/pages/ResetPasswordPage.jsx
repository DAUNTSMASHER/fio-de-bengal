import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './LoginPage.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);

    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request reset');
      
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);

    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', token, newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      
      setMessage(data.message);
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
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            {token ? 'Enter your new password below.' : 'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {error && <div className="auth-error-msg">{error}</div>}
        {message && <div className="auth-success-msg">{message}</div>}

        {!token ? (
          <form className="auth-form" onSubmit={handleRequestReset}>
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
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="auth-form-group">
              <label className="auth-label">New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="auth-input"
                placeholder="Create a new password"
              />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" className="auth-link">&larr; Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
