import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Package, MessageCircle, LogOut } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';
import './BuyerPanel.css';

const BuyerPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('negotiations');
  const [inquiries, setInquiries] = useState([]);
  const [activeInquiry, setActiveInquiry] = useState(null);

  useEffect(() => {
    if (user && user.role === 'buyer') {
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`/api/inquiries?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setInquiries(data);
    } catch (err) {
      console.error("Error fetching inquiries", err);
    }
  };

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
            <button className={`nav-btn ${activeTab === 'negotiations' ? 'active' : ''}`} onClick={() => { setActiveTab('negotiations'); setActiveInquiry(null); }}>
              <MessageCircle size={18} /> Negotiations
            </button>
            <button className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setActiveInquiry(null); }}>
              <Package size={18} /> My Orders
            </button>
            <button className="nav-btn text-danger" onClick={handleLogout}><LogOut size={18} /> Logout</button>
          </nav>
        </aside>
        
        <main className="dashboard-content">
          {activeTab === 'negotiations' && (
            <>
              {activeInquiry ? (
                <div>
                  <button className="btn btn-outline" style={{marginBottom: '16px'}} onClick={() => setActiveInquiry(null)}>
                    &larr; Back to List
                  </button>
                  <ChatWindow 
                    inquiry={activeInquiry} 
                    currentUser={user} 
                    onDealFinalized={() => { fetchInquiries(); setActiveInquiry(null); }}
                  />
                </div>
              ) : (
                <>
                  <h1>Active Negotiations</h1>
                  <p className="subtitle">Track and chat about your custom wholesale quotations.</p>
                  
                  {inquiries.length === 0 ? (
                    <div style={{padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '12px'}}>
                      <p>You have no active negotiations.</p>
                      <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {inquiries.map(inq => (
                        <div key={inq.id} className="order-card" style={{ cursor: 'pointer' }} onClick={() => setActiveInquiry(inq)}>
                          <div className="order-header">
                            <div>
                              <span className="order-id">Quotation for {inq.product_name}</span>
                              <span className="order-date">Created on {new Date(inq.created_at).toLocaleDateString()}</span>
                            </div>
                            <span className={`status-badge ${inq.status === 'Completed' ? 'delivered' : 'pending'}`}>
                              {inq.status}
                            </span>
                          </div>
                          <div className="order-items">
                            <div className="order-item" style={{border: 'none', padding: '10px 0'}}>
                              <div className="item-info">
                                <p><strong>Specs:</strong> {inq.base}, {inq.color}, {inq.density}</p>
                                <p><strong>Quantity:</strong> {inq.quantity} pieces</p>
                              </div>
                              <div className="item-price">Offer: ${Number(inq.offered_price).toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="order-footer">
                            <button className="btn btn-primary w-100">Open Chat</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <h1>Order History</h1>
              <p className="subtitle">View your finalized wholesale orders.</p>
              <div className="orders-list">
                {inquiries.filter(i => i.status === 'Completed').map(inq => (
                  <div key={inq.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <span className="order-id">Deal Finalized</span>
                        <span className="order-date">{new Date(inq.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="status-badge delivered">Completed</span>
                    </div>
                    <div className="order-items">
                      <div className="order-item">
                        <div className="item-info">
                          <h4>{inq.product_name}</h4>
                          <p>Qty: {inq.quantity} | Specs: {inq.base}, {inq.color}, {inq.density}</p>
                        </div>
                        <div className="item-price">${(inq.final_price * inq.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BuyerPanel;
