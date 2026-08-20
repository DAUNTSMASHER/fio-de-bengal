import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="page-layout texture-hair-strand">
      <div className="container cart-container">
        <h1 className="page-title">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is currently empty.</p>
            <Link to="/" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-option">Length: {item.options.length}</p>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="item-actions">
                    <input 
                      type="number" 
                      value={item.quantity} 
                      min="1"
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), item.options)}
                      className="quantity-input"
                    />
                    <button className="remove-btn" onClick={() => removeFromCart(item.id, item.options)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <button className="btn btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
