import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      {/* Background Video */}
      <video 
        src="/design_assets/hero_video.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline
        className="hero-bg-video" 
      />
      
      {/* Background Logo */}
      <div className="hero-bg-logo-wrapper">
        <img 
          src="/design_assets/fio_generated_tiger_logo.png" 
          alt="FIO de Bengal Tiger" 
          className="hero-bg-logo" 
        />
      </div>

      <div className="hero-video-overlay"></div>
      
      {/* Foreground Content */}
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
      </div>
    </section>
  );
};

export default Hero;
