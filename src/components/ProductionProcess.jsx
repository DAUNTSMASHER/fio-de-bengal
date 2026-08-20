import React from 'react';
import './ProductionProcess.css';

const ProductionProcess = () => {
  return (
    <section className="production-process" id="process">
      <div className="container process-container">
        <div className="process-visual">
          <img 
            src="/design_assets/Illustrations of wig produce.jpg" 
            alt="Wig Production Process" 
            className="process-img"
          />
        </div>
        <div className="process-content-overlay">
          <h2 className="section-title">Meticulous Craftsmanship</h2>
          <p className="section-description">
            Our commitment to quality begins long before the hair reaches your salon. Every wig and bundle goes through a rigorous multi-step inspection and hand-crafting process to ensure longevity, fullness, and unparalleled softness.
          </p>
          <div className="process-steps">
            <div className="step">
              <span className="step-number">01</span>
              <div>
                <h4>Ethical Sourcing</h4>
                <p>100% pure raw donor hair.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">02</span>
              <div>
                <h4>Cuticle Alignment</h4>
                <p>Ensuring zero tangles and shedding.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">03</span>
              <div>
                <h4>Hand Ventilation</h4>
                <p>Expertly tied laces for a natural scalp.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductionProcess;
