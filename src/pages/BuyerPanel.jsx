import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut } from 'lucide-react';
import './BuyerPanel.css';

const BuyerPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Protect route
  if (!user || user.role !== 'buyer') {
    return <div className="unauthorized">Access Denied. Customers only.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-layout texture-bengal-wave">
      <div className="container dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            <div className="avatar">
              <User size={32} color="white" />
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <nav className="dashboard-nav">
            <button className="nav-btn active"><Package size={18} /> My Orders</button>
            <button className="nav-btn"><User size={18} /> Account Details</button>
            <button className="nav-btn text-danger" onClick={handleLogout}><LogOut size={18} /> Logout</button>
          </nav>
        </aside>
        
        <main className="dashboard-content">
          <h1>Order History</h1>
          <p className="subtitle">View and track your recent purchases.</p>
          
          <div className="orders-list">
            <div className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">#ORD-9823</span>
                  <span className="order-date">Placed on Oct 10, 2024</span>
                </div>
                <span className="status-badge shipped">Shipped</span>
              </div>
              <div className="order-items">
                <div className="order-item">
                  <div className="item-img-placeholder"></div>
                  <div className="item-info">
                    <h4>Raw Bengal Hair Bundle - 18"</h4>
                    <p>Qty: 2</p>
                  </div>
                  <div className="item-price">$240.00</div>
                </div>
              </div>
              <div className="order-footer">
                <button className="btn btn-outline">Track Package</button>
                <div className="order-total">
                  <span>Total:</span>
                  <strong>$240.00</strong>
                </div>
              </div>
            </div>

            <div className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">#ORD-8104</span>
                  <span className="order-date">Placed on Sep 02, 2024</span>
                </div>
                <span className="status-badge delivered">Delivered</span>
              </div>
              <div className="order-items">
                <div className="order-item">
                  <div className="item-img-placeholder"></div>
                  <div className="item-info">
                    <h4>Deep Wave Closure</h4>
                    <p>Qty: 1</p>
                  </div>
                  <div className="item-price">$85.00</div>
                </div>
              </div>
              <div className="order-footer">
                <button className="btn btn-outline">Buy Again</button>
                <div className="order-total">
                  <span>Total:</span>
                  <strong>$85.00</strong>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyerPanel;
