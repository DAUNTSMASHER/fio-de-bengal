import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ limit, title }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Adding a timestamp to bust local browser cache
    fetch(`/api/products?t=${new Date().getTime()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        // Ensure it's an array
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setError("Unable to load products. Please try refreshing.");
        setLoading(false);
      });
  }, []);

  const displayProducts = limit ? products.slice(0, limit) : products;

  return (
    <section className="product-section" id="products">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title || "Wholesale Collection"}</h2>
          <p className="section-subtitle">Pristine quality bundles and lace systems for your business.</p>
        </div>
        
        {loading && <div style={{textAlign: 'center', padding: '60px 0'}}>Loading products...</div>}
        {error && <div style={{textAlign: 'center', color: 'red', padding: '60px 0'}}>{error}</div>}

        {!loading && !error && (
          <>
            <div className="product-grid">
              {displayProducts.length > 0 ? (
                displayProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div style={{textAlign: 'center', gridColumn: '1 / -1', padding: '40px'}}>
                  No products found. Start adding some from the Admin Panel!
                </div>
              )}
            </div>
            
            {limit && products.length > limit && (
              <div style={{textAlign: 'center', marginTop: '40px'}}>
                <button className="btn btn-outline" style={{padding: '12px 30px', fontSize: '1.1rem'}} onClick={() => navigate('/products')}>
                  View All {products.length} Products &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
