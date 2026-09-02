import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo-group" style={{display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '16px'}}>
            <img src="/design_assets/fio_generated_tiger_logo.png" alt="Tiger Icon" className="footer-logo" />
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'var(--text-primary)', fontFamily: 'Georgia, serif', lineHeight: 1.1}}>
              <span style={{fontSize: '16px', fontWeight: '600', letterSpacing: '4px'}}>FIO DE</span>
              <span style={{fontSize: '26px', fontWeight: '700', letterSpacing: '2px'}}>BENGAL</span>
            </div>
          </div>
          <p className="footer-description">Premium Wholesale Wigs.</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="link-group">
            <h4>Support</h4>
            <Link to="/faq">FAQ</Link>
            <Link to="/shipping">Shipping Policy</Link>
          </div>
          <div className="link-group">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} FIO de Bengal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
