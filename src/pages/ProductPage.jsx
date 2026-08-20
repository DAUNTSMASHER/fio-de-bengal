import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [length, setLength] = useState('18"');
  const [quantity, setQuantity] = useState(1);

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch product
    fetch(`/api/products?t=${new Date().getTime()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => {
        const foundProduct = data.find(p => p.id === parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch inventory
    fetch(`/api/inventory?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => setInventory(data || []))
      .catch(err => console.error("Error fetching inventory", err));
  }, [id]);

  if (loading) {
    return <div className="page-layout"><div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h2>Loading Product...</h2></div></div>;
  }

  if (error || !product) {
    return <div className="page-layout"><div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h2>{error || "Product Not Found"}</h2></div></div>;
  }

  const handleAddToCart = () => {
    addToCart({ 
      id: product.id, 
      name: `${product.name} - ${length}`, 
      price: product.price,
      image: product.image
    }, quantity, { length });
    navigate('/cart');
  };

  const baseInventory = inventory.filter(i => i.category === 'base');
  const colorInventory = inventory.filter(i => i.category === 'color');
  const densityInventory = inventory.filter(i => i.category === 'density');

  return (
    <div className="page-layout texture-bengal-wave">
      <div className="container product-detail-container">
        <div className="product-image-gallery">
          <div className="main-image">
            <img src={product.image || '/design_assets/fio_main_logo.png'} alt={product.name} className="product-main-img" />
          </div>
        </div>
        <div className="product-info-panel">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-sku">SKU: {product.sku}</p>
          <p className="product-price">${Number(product.price).toFixed(2)} USD</p>
          
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
            <h3>Description</h3>
            <p>{product.description}</p>
            <p className="moq-text"><strong>Minimum Order:</strong> {product.moq || '1 piece'}</p>
          </div>
        </div>
      </div>
      
      {/* Global Inventory Section */}
      <div className="container inventory-section">
        <h2 className="inventory-section-title">Current Global Availability</h2>
        <div className="inventory-tables-grid">
          
          {/* Base Sizes Table */}
          <div className="inventory-card">
            <h3>Base Sizes</h3>
            <table className="inventory-table">
              <thead><tr><th>Base</th><th>Stock (approx.)</th></tr></thead>
              <tbody>
                {baseInventory.map(item => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td><span className="stock-badge">{item.quantity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Colors Table */}
          <div className="inventory-card">
            <h3>Colors</h3>
            <table className="inventory-table">
              <thead><tr><th>Color</th><th>Stock (approx.)</th></tr></thead>
              <tbody>
                {colorInventory.map(item => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td><span className="stock-badge">{item.quantity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Density Table */}
          <div className="inventory-card">
            <h3>Density</h3>
            <table className="inventory-table">
              <thead><tr><th>Density</th><th>Stock (approx.)</th></tr></thead>
              <tbody>
                {densityInventory.map(item => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td><span className="stock-badge">{item.quantity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductPage;
