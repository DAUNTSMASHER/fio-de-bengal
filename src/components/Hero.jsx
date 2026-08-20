import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        
        {/* LEFT COLUMN: Logo & Text (50% Width) */}
        <div className="hero-left-column">
          {/* Logo takes ~35% of total screen area (70% of this column's height) */}
          <div className="hero-logo-container">
            <img 
              src="/design_assets/fio_generated_tiger_logo.png" 
              alt="FIO de Bengal Tiger" 
              className="hero-tiger-logo" 
            />
          </div>
          
          {/* Text takes ~15% of total screen area (30% of this column's height) */}
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

        {/* RIGHT COLUMN: Video (50% Width) */}
        <div className="hero-right-column">
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
