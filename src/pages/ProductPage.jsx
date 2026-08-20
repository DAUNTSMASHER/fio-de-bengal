import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [length, setLength] = useState('18"');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ id, name: `Raw Bengal Hair Bundle - ${length}`, price: 120 }, quantity, { length });
    navigate('/cart');
  };

  return (
    <div className="page-layout texture-bengal-wave">
      <div className="container product-detail-container">
        <div className="product-image-gallery">
          <div className="main-image"></div>
        </div>
        <div className="product-info-panel">
          <h1 className="product-title">Raw Bengal Hair Bundle</h1>
          <p className="product-price">$120.00 USD</p>
          <div className="product-options">
            <label>Length</label>
            <div className="length-options">
              {['14"', '16"', '18"', '20"', '22"'].map(l => (
                <button 
                  key={l} 
                  className={`option-btn ${length === l ? 'active' : ''}`}
                  onClick={() => setLength(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="product-actions">
            <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
          <div className="product-description">
            <p>100% Raw unprocessed donor hair. Cuticle aligned, completely natural state.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
