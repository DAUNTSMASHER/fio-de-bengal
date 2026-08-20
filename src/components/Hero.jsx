import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        
        {/* Left Column: Logo */}
        <div className="hero-logo-side">
          <img 
            src="/design_assets/fio_generated_tiger_logo.png" 
            alt="FIO de Bengal Tiger" 
            className="hero-tiger-logo" 
          />
        </div>
        
        {/* Right Column: Text */}
        <div className="hero-content-side">
          <h1 className="hero-title">Premium Wholesale Wigs</h1>
          <p className="hero-subtitle">
            Discover our exclusive collection of high-quality, minimal-maintenance wigs designed for top-tier salons and retailers.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Pedir Muestra / Solicitar Amostra</button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
