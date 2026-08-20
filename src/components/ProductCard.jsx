import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id || 1}`} className="product-card" style={{textDecoration: 'none'}}>
      <div className="product-image-wrapper">
        {/* Placeholder for macro shots */}
        <div className="product-image-placeholder"></div>
        {product.isGuaranteed && (
          <div className="product-badge">
            <img src="/design_assets/fio_guarantee_badge.png" className="custom-icon guarantee-small-icon" alt="Guaranteed" />
            Guaranteed
          </div>
        )}
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-sku">SKU: {product.sku}</p>
        <div className="product-footer">
          <span className="product-moq">MOQ: {product.moq}</span>
          <button className="btn-icon">
            <img src="/design_assets/fio_arrow_icon.png" className="custom-icon arrow-icon" alt="View Product" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
