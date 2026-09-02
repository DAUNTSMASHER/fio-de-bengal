import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [inventory, setInventory] = useState([]);
  
  // Quotation States
  const [modelVariant, setModelVariant] = useState('');
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [offeredPrice, setOfferedPrice] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch product
    fetch(`/api/products?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error(data.error || "Invalid response format from server");
        }
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

    // Fetch inventory for specific product
    fetch(`/api/inventory?product_id=${id}&t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => setInventory(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching inventory", err));
  }, [id]);

  // Extract unique options for dropdowns
  const uniqueBases = [...new Set(inventory.map(i => i.base_size))];
  const uniqueColors = [...new Set(inventory.map(i => i.color))];
  const uniqueLengths = [...new Set(inventory.map(i => i.length))];

  const handleAddToCart = () => {
    if (!user) return alert("You must be logged in to build a wholesale quotation.");
    if (!selectedBase || !selectedColor || !selectedLength || !quantity || !offeredPrice) {
      return alert("Please fill out all quotation fields before proceeding.");
    }
    
    addToCart(
      { id: product.id, name: product.name, price: parseFloat(offeredPrice) }, 
      parseInt(quantity), 
      {
        modelVariant: modelVariant,
        base: selectedBase,
        color: selectedColor,
        length: selectedLength
      }
    );
    
    alert(`Added ${quantity}x ${product.name} to your Wholesale Cart!`);
    navigate('/cart');
  };

  if (loading) return <div className="page-layout"><div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h2>Loading Product...</h2></div></div>;
  if (error || !product) return <div className="page-layout"><div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h2>{error || "Product Not Found"}</h2></div></div>;

  return (
    <div className="page-layout texture-bengal-wave">
      <div className="container product-detail-container" style={{ padding: '80px', gap: '64px' }}>
        <div className="product-image-gallery">
          <div className="main-image">
            <img src={product.image || '/design_assets/fio_main_logo.png'} alt={product.name} className="product-main-img" />
          </div>

        </div>
        
        <div className="product-info-panel">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-sku">SKU: {product.sku}</p>
          <p className="product-price">Retail Reference: ${Number(product.price).toFixed(2)} USD</p>
          <div className="product-description" style={{ marginTop: '10px' }}>
            <p>{product.description}</p>
          </div>
          
          <div className="quotation-form-card">
            <h3>Build Wholesale Quotation</h3>
            {!user ? (
              <div className="login-warning">
                <p>You must be logged in to build and submit a wholesale quotation.</p>
                <button className="btn btn-primary" onClick={() => navigate('/login')} style={{marginTop:'15px'}}>Login or Register</button>
              </div>
            ) : (
              <div className="quotation-form">
                <div className="form-group">
                  <label>Model Variant (Optional)</label>
                  <input type="text" placeholder="e.g. Standard, Premium Edition" value={modelVariant} onChange={e => setModelVariant(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Base Size</label>
                  <select value={selectedBase} onChange={e => setSelectedBase(e.target.value)} className="form-control">
                    <option value="">Select Base</option>
                    {uniqueBases.map((b, idx) => <option key={idx} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Length</label>
                  <select value={selectedLength} onChange={e => setSelectedLength(e.target.value)} className="form-control">
                    <option value="">Select Length</option>
                    {uniqueLengths.map((l, idx) => <option key={idx} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className="form-control">
                    <option value="">Select Color</option>
                    {uniqueColors.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Quantity</label>
                    <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="form-control" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Your Offer Price ($)</label>
                    <input type="number" min="1" step="0.01" placeholder="e.g. 110.00" value={offeredPrice} onChange={e => setOfferedPrice(e.target.value)} className="form-control" />
                  </div>
                </div>
                <button className="btn btn-primary w-100" onClick={handleAddToCart} style={{marginTop: '10px'}}>
                  Add to Wholesale Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Full-width Integrated Model Availability Table */}
        <div className="integrated-inventory" style={{marginTop: '20px', gridColumn: '1 / -1'}}>
          <h3 style={{marginBottom: '15px', color: 'var(--text-primary)', borderBottom: '2px solid var(--accent-gold)', display: 'inline-block', paddingBottom: '4px'}}>Current Model Availability</h3>
          <div className="inventory-card" style={{padding: 0, overflow: 'hidden', border: '1px solid var(--border-muted)', borderRadius: '12px'}}>
            <div className="inventory-table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Base Size</th>
                    <th>Length</th>
                    <th>Color</th>
                    <th style={{textAlign: 'center'}}>Processing Time</th>
                    <th style={{textAlign: 'center'}}>Delivery Time</th>
                    <th style={{textAlign: 'center'}}>Total Time</th>
                    <th style={{textAlign: 'center'}}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.length > 0 ? inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.base_size}</td>
                      <td>{item.length}</td>
                      <td>{item.color}</td>
                      <td style={{textAlign: 'center'}}>3-5 Days</td>
                      <td style={{textAlign: 'center'}}>3-5 Days</td>
                      <td style={{textAlign: 'center'}}><strong>6-10 Days</strong></td>
                      <td style={{textAlign: 'center'}}><span className="stock-badge">{item.quantity}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" style={{padding: '20px', textAlign: 'center'}}>No inventory data found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
