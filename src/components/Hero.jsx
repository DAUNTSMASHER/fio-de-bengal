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
          <div className="hero-video-wrapper">
            <video 
              src="/design_assets/hero_video.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="hero-video" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
