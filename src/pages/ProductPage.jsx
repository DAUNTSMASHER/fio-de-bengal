import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [inventory, setInventory] = useState([]);
  
  // Quotation States
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedDensity, setSelectedDensity] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [offeredPrice, setOfferedPrice] = useState('');
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch product
    fetch(`/api/products?t=${new Date().getTime()}`)
      .then(res => res.json())
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

  const baseInventory = inventory.filter(i => i.category === 'base');
  const colorInventory = inventory.filter(i => i.category === 'color');
  const densityInventory = inventory.filter(i => i.category === 'density');

  const handleOpenModal = () => {
    if (!selectedBase || !selectedColor || !selectedDensity || !quantity || !offeredPrice) {
      return alert("Please fill out all quotation fields before proceeding.");
    }
    setShowModal(true);
  };

  const submitInquiry = async () => {
    if (!user) return alert("You must be logged in!");
    setSubmitting(true);
    
    try {
      // 1. Create Inquiry
      const inqRes = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_email: user.email,
          product_id: product.id,
          product_name: product.name,
          base: selectedBase,
          color: selectedColor,
          density: selectedDensity,
          quantity: parseInt(quantity),
          offered_price: parseFloat(offeredPrice)
        })
      });
      const inqData = await inqRes.json();
      if (!inqRes.ok) throw new Error(inqData.error || 'Failed to submit inquiry');
      
      const inquiryId = inqData.meta?.last_row_id || Math.floor(Math.random()*10000);

      // 2. Send Initial Message
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry_id: inquiryId,
          sender_role: 'buyer',
          sender_name: user.name,
          message: message || "I would like to negotiate this deal."
        })
      });

      alert("Quotation submitted successfully! You can track this in your dashboard.");
      setShowModal(false);
      navigate('/dashboard'); // Navigate to buyer panel
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-layout"><div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h2>Loading Product...</h2></div></div>;
  if (error || !product) return <div className="page-layout"><div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h2>{error || "Product Not Found"}</h2></div></div>;

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
                  <label>Base Size</label>
                  <select value={selectedBase} onChange={e => setSelectedBase(e.target.value)} className="form-control">
                    <option value="">Select Base</option>
                    {baseInventory.map(i => <option key={i.id} value={i.label}>{i.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className="form-control">
                    <option value="">Select Color</option>
                    {colorInventory.map(i => <option key={i.id} value={i.label}>{i.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Density</label>
                  <select value={selectedDensity} onChange={e => setSelectedDensity(e.target.value)} className="form-control">
                    <option value="">Select Density</option>
                    {densityInventory.map(i => <option key={i.id} value={i.label}>{i.label}</option>)}
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
                <button className="btn btn-primary w-100" onClick={handleOpenModal} style={{marginTop: '10px'}}>
                  Send Inquiry & Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Global Inventory Section */}
      <div className="container inventory-section">
        <h2 className="inventory-section-title">Current Global Availability</h2>
        <div className="inventory-tables-grid">
          <div className="inventory-card">
            <h3>Base Sizes</h3>
            <table className="inventory-table">
              <thead><tr><th>Base</th><th>Stock (approx.)</th></tr></thead>
              <tbody>
                {baseInventory.map(item => (
                  <tr key={item.id}><td>{item.label}</td><td><span className="stock-badge">{item.quantity}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="inventory-card">
            <h3>Colors</h3>
            <table className="inventory-table">
              <thead><tr><th>Color</th><th>Stock (approx.)</th></tr></thead>
              <tbody>
                {colorInventory.map(item => (
                  <tr key={item.id}><td>{item.label}</td><td><span className="stock-badge">{item.quantity}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="inventory-card">
            <h3>Density</h3>
            <table className="inventory-table">
              <thead><tr><th>Density</th><th>Stock (approx.)</th></tr></thead>
              <tbody>
                {densityInventory.map(item => (
                  <tr key={item.id}><td>{item.label}</td><td><span className="stock-badge">{item.quantity}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h2>Send Message to Admin</h2>
            <p>You are offering <strong>${offeredPrice}</strong> for <strong>{quantity}x</strong> of {product.name} ({selectedBase}, {selectedColor}, {selectedDensity}).</p>
            <div className="form-group" style={{marginTop: '20px'}}>
              <label>Message (Optional)</label>
              <textarea 
                rows="4" 
                className="form-control" 
                placeholder="Include any additional requirements or negotiation notes..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-actions" style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
              <button className="btn btn-primary" onClick={submitInquiry} disabled={submitting}>
                {submitting ? 'Sending...' : 'Submit Quotation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
