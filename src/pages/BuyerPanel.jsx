import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, MessageSquare, LogOut, Home } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';
// Import AdminPanel CSS to share the exact same sleek full-screen layout
import './AdminPanel.css'; 

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
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand-box">
          <img src="/design_assets/fio_tiger_icon.png" alt="Tiger" className="sidebar-tiger-icon" />
          <div className="sidebar-brand-text">
            <span>FIO DE</span>
            <span>BENGAL</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'negotiations' ? 'active' : ''}`} onClick={() => { setActiveTab('negotiations'); setActiveInquiry(null); }}>
            <MessageSquare size={20} /> Negotiations
          </button>
          <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setActiveInquiry(null); }}>
            <Package size={20} /> My Orders
          </button>
          <button className="nav-item" onClick={() => navigate('/')}>
            <Home size={20} /> Back to Store
          </button>
        </nav>
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </aside>
      
      <main className="admin-content texture-bengal-wave">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-profile">
            <span>{user.name}</span>
          </div>
        </header>

        <div className="admin-body">
          {activeTab === 'negotiations' && (
            <div className="admin-card">
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
                  <h2>Active Negotiations</h2>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Specs</th>
                        <th>Qty</th>
                        <th>Your Offer</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.length === 0 ? (
                        <tr><td colSpan="6" style={{textAlign:'center', padding: '20px'}}>You have no active negotiations.</td></tr>
                      ) : (
                        inquiries.map(inq => (
                          <tr key={inq.id}>
                            <td>{inq.product_name}</td>
                            <td>
                              {inq.cart_items ? (
                                <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                                  Bulk Order ({JSON.parse(inq.cart_items).length} configs)
                                </span>
                              ) : (
                                <span>{inq.base}, {inq.color}, {inq.length} {inq.model_variant ? `| ${inq.model_variant}` : ''}</span>
                              )}
                            </td>
                            <td>{inq.quantity}</td>
                            <td>${Number(inq.offered_price).toFixed(2)}</td>
                            <td><span className={`status-badge ${inq.status === 'Completed' ? 'delivered' : 'pending'}`}>{inq.status}</span></td>
                            <td>
                              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setActiveInquiry(inq)}>
                                Open Chat
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-card">
              <h2>Order History</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Deal ID</th>
                    <th>Product</th>
                    <th>Specs</th>
                    <th>Qty</th>
                    <th>Final Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.filter(i => i.status === 'Completed').length === 0 ? (
                    <tr><td colSpan="6" style={{textAlign:'center', padding: '20px'}}>No finalized orders yet.</td></tr>
                  ) : (
                    inquiries.filter(i => i.status === 'Completed').map(inq => (
                      <tr key={inq.id}>
                        <td>#DEAL-{inq.id}</td>
                        <td>{inq.product_name}</td>
                        <td>
                          {inq.cart_items ? (
                            <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                              Bulk Order ({JSON.parse(inq.cart_items).length} configs)
                            </span>
                          ) : (
                            <span>{inq.base}, {inq.color}, {inq.length} {inq.model_variant ? `| ${inq.model_variant}` : ''}</span>
                          )}
                        </td>
                        <td>{inq.quantity}</td>
                        <td>${(inq.final_price * inq.quantity).toFixed(2)}</td>
                        <td><span className="status-badge delivered">Paid & Shipped</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuyerPanel;
