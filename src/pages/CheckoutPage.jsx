import React from 'react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { getCartTotal } = useCart();

  return (
    <div className="page-layout texture-marble-venation">
      <div className="container checkout-container">
        <h1 className="page-title">Secure Checkout</h1>
        <div className="checkout-layout">
          <div className="checkout-form">
            <h2>Shipping Information</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input type="text" placeholder="Full Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Shipping Address" required />
              </div>
              <div className="form-row">
                <input type="text" placeholder="City" required />
                <input type="text" placeholder="Postal Code" required />
              </div>
              
              <h2 style={{marginTop: '32px'}}>Payment Details (Mock)</h2>
              <div className="form-group">
                <input type="text" placeholder="Card Number" />
              </div>
              <div className="form-row">
                <input type="text" placeholder="MM/YY" />
                <input type="text" placeholder="CVC" />
              </div>
              <button type="submit" className="btn btn-primary place-order-btn">
                Place Order • ${getCartTotal().toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
