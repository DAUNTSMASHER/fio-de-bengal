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
    <div className="page-layout texture-bengal-wave" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="login-card" style={{ background: 'var(--surface-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 12px 24px rgba(0,0,0,0.06)', border: '1px solid var(--border-muted)', maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/design_assets/Logo.png" alt="Fio de Bengal" style={{ height: '60px', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            {token ? 'Enter your new password below.' : 'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}
        {message && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>{message}</div>}

        {!token ? (
          <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="form-control"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
          <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>&larr; Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
