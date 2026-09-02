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
