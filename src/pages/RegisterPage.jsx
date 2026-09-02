import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import './LoginPage.css';

const RegisterPage = () => {
  const { user, isLoaded, setSession } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
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
    <div className="page-layout texture-bengal-wave" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="login-card" style={{ background: 'var(--surface-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 12px 24px rgba(0,0,0,0.06)', border: '1px solid var(--border-muted)', maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/design_assets/Logo.png" alt="Fio de Bengal" style={{ height: '60px', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Join Fio de Bengal for exclusive wholesale access.</p>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}
            />
          </div>
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
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
