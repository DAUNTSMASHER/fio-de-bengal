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
  const [selectedLength, setSelectedLength] = useState('');
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

    // Fetch inventory for specific product
    fetch(`/api/inventory?product_id=${id}&t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => setInventory(data || []))
      .catch(err => console.error("Error fetching inventory", err));
  }, [id]);

  // Extract unique options for dropdowns
  const uniqueBases = [...new Set(inventory.map(i => i.base_size))];
  const uniqueColors = [...new Set(inventory.map(i => i.color))];
  const uniqueLengths = [...new Set(inventory.map(i => i.length))];

  const handleOpenModal = () => {
    if (!selectedBase || !selectedColor || !selectedLength || !quantity || !offeredPrice) {
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
          length: selectedLength, // Assuming the backend is updated to accept length instead of density if needed, or we just pass it along
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

          {/* Integrated Model Availability Table - Moved to Left Column for Symmetry */}
          <div className="integrated-inventory" style={{marginTop: '40px'}}>
            <h3 style={{marginBottom: '15px'}}>Current Model Availability</h3>
            <div className="inventory-card" style={{padding: 0, overflow: 'hidden'}}>
              <div style={{overflowX: 'auto'}}>
                <table className="inventory-table" style={{width: '100%', borderCollapse: 'collapse', minWidth: '600px'}}>
                  <thead style={{background: '#f8f8f8', textAlign: 'left'}}>
                    <tr>
                      <th style={{padding: '12px 16px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap'}}>Base Size</th>
                      <th style={{padding: '12px 16px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap'}}>Length</th>
                      <th style={{padding: '12px 16px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap'}}>Color</th>
                      <th style={{padding: '12px 16px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap'}}>Processing Time</th>
                      <th style={{padding: '12px 16px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap'}}>Delivery Time</th>
                      <th style={{padding: '12px 16px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap'}}>Total Time</th>
                      <th style={{padding: '12px 16px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap'}}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.length > 0 ? inventory.map(item => (
                      <tr key={item.id} style={{borderBottom: '1px solid #eee'}}>
                        <td style={{padding: '12px 16px'}}>{item.base_size}</td>
                        <td style={{padding: '12px 16px'}}>{item.length}</td>
                        <td style={{padding: '12px 16px'}}>{item.color}</td>
                        <td style={{padding: '12px 16px'}}>3-5 Days</td>
                        <td style={{padding: '12px 16px'}}>3-5 Days</td>
                        <td style={{padding: '12px 16px'}}>6-10 Days</td>
                        <td style={{padding: '12px 16px'}}><span className="stock-badge" style={{background: '#e6fffa', color: '#008060', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold'}}>{item.quantity}</span></td>
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
                <button className="btn btn-primary w-100" onClick={handleOpenModal} style={{marginTop: '10px'}}>
                  Send Inquiry & Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h2>Send Message to Admin</h2>
            <p>You are offering <strong>${offeredPrice}</strong> for <strong>{quantity}x</strong> of {product.name} ({selectedBase}, {selectedLength}, {selectedColor}).</p>
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
