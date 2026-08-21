import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = () => {
    if (!user) return alert("You must be logged in to submit a quotation!");
    setShowModal(true);
  };

  const submitBulkInquiry = async () => {
    setSubmitting(true);
    try {
      // 1. Create Inquiry
      const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = getCartTotal();
      
      const inqRes = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_email: user.email,
          product_id: null,
          product_name: "Multi-Item Bulk Order",
          quantity: totalQty,
          offered_price: totalPrice,
          cart_items: JSON.stringify(cart)
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
          message: message || "I would like to negotiate this bulk order."
        })
      });

      alert("Bulk Quotation submitted successfully! Admin will review your offers.");
      clearCart();
      setShowModal(false);
      navigate('/dashboard'); 
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-layout texture-bengal-wave">
      <div className="container cart-container">
        <h1 className="page-title">Your Wholesale Inquiry Cart</h1>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your inquiry cart is currently empty.</p>
            <Link to="/products" className="btn btn-primary">Browse Models</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '32px 40px', borderRadius: '12px', border: '1px solid var(--border-muted)', marginBottom: '15px'}}>
                  <div className="item-details" style={{flex: 1}}>
                    <h3 style={{margin: '0 0 10px 0'}}>{item.name} {item.options.modelVariant ? `(${item.options.modelVariant})` : ''}</h3>
                    <div style={{display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px'}}>
                      <span><strong>Size:</strong> {item.options.base}</span>
                      <span><strong>Length:</strong> {item.options.length}</span>
                      <span><strong>Color:</strong> {item.options.color}</span>
                    </div>
                    <p className="item-price" style={{margin: 0, fontWeight: '600', color: 'var(--accent-gold)'}}>Your Offer: ${item.price.toFixed(2)} / ea</p>
                  </div>
                  <div className="item-actions" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <label style={{fontSize: '0.8rem', marginBottom: '4px'}}>Qty</label>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        min="1"
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), item.options)}
                        className="quantity-input form-control"
                        style={{width: '70px', padding: '6px', textAlign: 'center'}}
                      />
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id, item.options)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '16px'}}>
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary" style={{background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-muted)', height: 'fit-content'}}>
              <h3 style={{borderBottom: '2px solid var(--accent-gold)', paddingBottom: '10px', marginBottom: '20px'}}>Quotation Summary</h3>
              <div className="summary-row" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                <span>Total Pieces</span>
                <strong>{cart.reduce((acc, i) => acc + i.quantity, 0)} pcs</strong>
              </div>
              <div className="summary-row total" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '1.2rem', fontWeight: 'bold'}}>
                <span>Total Offer</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <button className="btn btn-primary checkout-btn w-100" onClick={handleOpenModal} style={{width: '100%'}}>
                Submit Bulk Quotation
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h2>Submit Bulk Inquiry</h2>
            <p>You are submitting an inquiry for <strong>{cart.reduce((acc, i) => acc + i.quantity, 0)} items</strong> with a total offered value of <strong>${getCartTotal().toFixed(2)}</strong>.</p>
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
              <button className="btn btn-primary" onClick={submitBulkInquiry} disabled={submitting}>
                {submitting ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
