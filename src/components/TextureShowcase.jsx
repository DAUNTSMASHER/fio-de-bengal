import React from 'react';
import './TextureShowcase.css';

const TextureShowcase = () => {
  return (
    <section className="texture-showcase" id="textures" style={{ backgroundImage: `url('/design_assets/Different texture and styling.jpg')` }}>
      <div className="container showcase-container">
        <div className="showcase-content-overlay">
          <h2 className="section-title">Versatility in Every Strand</h2>
          <p className="section-description">
            From silky straight to deep wave, our 100% cuticle-aligned virgin hair allows for limitless styling possibilities. Every bundle holds curls effortlessly and bleaches to a flawless #613 blonde.
          </p>
          <ul className="texture-list">
            <li>✔ Bone Straight</li>
            <li>✔ Body Wave</li>
            <li>✔ Deep Wave</li>
            <li>✔ Water Wave</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TextureShowcase;
