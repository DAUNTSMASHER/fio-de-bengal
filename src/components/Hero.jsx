import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      {/* Absolute Background Layer - Left Aligned */}
      <div className="hero-bg-left-watermark">
        <img 
          src="/design_assets/fio_generated_tiger_logo.png" 
          alt="FIO de Bengal Tiger" 
          className="hero-bg-tiger-logo" 
        />
      </div>

      <div className="container hero-container">
        {/* Foreground Content - Right Aligned */}
        <div className="hero-content-right">
          <h1 className="hero-title">Premium Wholesale Wigs</h1>
          <p className="hero-subtitle">
            Discover our exclusive collection of high-quality, minimal-maintenance wigs designed for top-tier salons and retailers.
          </p>
          
          <div className="hero-trust-points" style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: 'var(--text-primary)', background: 'rgba(255, 255, 255, 0.9)', padding: '12px 20px', borderRadius: '8px', borderLeft: '4px solid var(--accent-gold)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: 'fit-content' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span><strong>Officially Registered UK Company</strong> (No. 17460327)</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: 'var(--text-primary)', background: 'rgba(255, 255, 255, 0.9)', padding: '12px 20px', borderRadius: '8px', borderLeft: '4px solid var(--accent-gold)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: 'fit-content' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>All Stock Dispatched directly from the <strong>United Kingdom</strong></span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: 'var(--text-primary)', background: 'rgba(255, 255, 255, 0.9)', padding: '12px 20px', borderRadius: '8px', borderLeft: '4px solid var(--accent-gold)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: 'fit-content' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span><strong>21-Day Refund Policy</strong> (Exclusive for Loyal Partners)</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
              Pedir Muestra / Solicitar Amostra
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
