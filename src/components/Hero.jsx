import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Premium Wholesale Wigs</h1>
          <p className="hero-subtitle">
            Discover our exclusive collection of high-quality, minimal-maintenance wigs designed for top-tier salons and retailers.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Pedir Muestra / Solicitar Amostra</button>
          </div>
        </div>
        <div className="hero-visual">
          {/* Placeholder for high-end hero image or video */}
          <div className="hero-placeholder">
            <img src="/design_assets/fio_guarantee_badge.png" className="custom-icon guarantee-icon" alt="Guarantee" />
            <p>Guaranteed Quality</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
