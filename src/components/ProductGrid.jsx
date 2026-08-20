import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Raw Indian Straight', sku: 'FIO-RS-001', moq: '5 pieces', isGuaranteed: true },
  { id: 2, name: 'Raw Indian Wavy', sku: 'FIO-RW-002', moq: '5 pieces', isGuaranteed: true },
  { id: 3, name: 'Raw Indian Curly', sku: 'FIO-RC-003', moq: '5 pieces', isGuaranteed: false },
  { id: 4, name: 'HD Lace Frontal (13x4)', sku: 'FIO-LF-004', moq: '10 pieces', isGuaranteed: true },
];

const ProductGrid = () => {
  return (
    <section className="product-section" id="products">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Wholesale Collection</h2>
          <p className="section-subtitle">Pristine quality bundles and lace systems for your business.</p>
        </div>
        
        <div className="product-grid">
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
