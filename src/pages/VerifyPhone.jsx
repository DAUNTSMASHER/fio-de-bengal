import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './LoginPage.css'; // Reuse styles

const VerifyPhone = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [phone, setPhone] = useState();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If they are already verified, redirect them away
  if (user && user.publicMetadata?.phoneVerified) {
    navigate('/dashboard');
    return null;
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/sms/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!response.ok) throw new Error('Failed to send OTP');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/sms/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otp }),
      });
      if (!response.ok) throw new Error('Invalid or expired OTP');
      
      // Reload user to get updated metadata, then navigate
      await user.reload();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout texture-marble-venation">
      <div className="container login-container" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <div className="login-box" style={{ maxWidth: '500px', width: '100%' }}>
          <h1 className="page-title">Verify Your Phone</h1>
          <p className="login-subtitle">For security reasons, we require a one-time phone verification.</p>
          
          {error && <div style={{color: 'red', marginBottom: '15px'}}>{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="login-form">
              <div className="form-group">
                <label>Phone Number</label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phone}
                  onChange={setPhone}
                  className="phone-input-field"
                  style={{ 
                    display: 'flex', 
                    padding: '12px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    background: '#fff'
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="login-form">
              <div className="form-group">
                <label>6-Digit Code</label>
                <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
                  placeholder="123456"
                  required
                  style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }}
                />
              </div>
              <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Profile'}
              </button>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                style={{background: 'none', border: 'none', color: '#666', marginTop: '10px', cursor: 'pointer', width: '100%'}}
              >
                Back to Phone Entry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
