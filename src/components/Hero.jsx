import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      {/* Left Half: Tiger Logo */}
      <div className="hero-split-left">
        <img 
          src="/design_assets/fio_generated_tiger_logo.png" 
          alt="FIO de Bengal Tiger" 
          className="hero-side-logo" 
        />
      </div>

      {/* Right Half: Video Background */}
      <div className="hero-split-right">
        <video 
          src="/design_assets/hero_video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="hero-side-video" 
        />
      </div>

      {/* Center Foreground Content */}
      <div className="hero-center-content">
        <h1 className="hero-title">Premium Wholesale Wigs</h1>
        <p className="hero-subtitle">
          Discover our exclusive collection of high-quality, minimal-maintenance wigs designed for top-tier salons and retailers.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Pedir Muestra / Solicitar Amostra</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
