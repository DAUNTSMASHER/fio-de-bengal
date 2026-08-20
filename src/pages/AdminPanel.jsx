import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Users, LogOut, UploadCloud, Archive, MessageSquare } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('negotiations');
  
  // Product State
  const [uploading, setUploading] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Inventory State
  const [inventory, setInventory] = useState([]);
  const [activeInventoryTab, setActiveInventoryTab] = useState('base');

  // Negotiations State
  const [inquiries, setInquiries] = useState([]);
  const [activeInquiry, setActiveInquiry] = useState(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetch(`/api/inventory?t=${new Date().getTime()}`)
        .then(res => res.json())
        .then(data => setInventory(data || []))
        .catch(err => console.error(err));
        
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`/api/inquiries?t=${new Date().getTime()}`);
      const data = await res.json();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Protect route
  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">Access Denied. Admin only.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setUploadedImageUrl(data.url);
      alert('Image successfully uploaded!');
    } catch (err) {
      alert('Upload Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !productPrice) return alert("Name and price required");

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,
          price: parseFloat(productPrice),
          description: productDescription,
          image: uploadedImageUrl
        })
      });
      if (!res.ok) throw new Error('Failed to save product');

      alert("Product saved to database successfully!");
      setProductName(''); setProductPrice(''); setProductDescription(''); setUploadedImageUrl('');
    } catch (err) {
      alert("Error saving product: " + err.message);
    }
  };

  const handleInventoryUpdate = async (id, currentQty) => {
    const newQty = prompt("Enter new quantity (e.g. '100-120' or 'Sold Out'):", currentQty);
    if (newQty === null || newQty === currentQty) return;

    try {
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity: newQty })
      });
      if (!res.ok) throw new Error('Failed to update');
      setInventory(inventory.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    } catch (err) {
      alert("Error updating inventory");
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>FIO DE BENGAL</h2>
          <span className="badge admin-badge">ADMIN</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Package size={20} /> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'negotiations' ? 'active' : ''}`} onClick={() => { setActiveTab('negotiations'); setActiveInquiry(null); fetchInquiries(); }}>
            <MessageSquare size={20} /> Negotiations
          </button>
          <button className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <Archive size={20} /> Inventory
          </button>
          <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <ShoppingCart size={20} /> Add Product
          </button>
          <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <Users size={20} /> Finalized Orders
          </button>
        </nav>
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="admin-content texture-bengal-muslin">
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
                  <button className="btn btn-outline" style={{marginBottom: '16px'}} onClick={() => { setActiveInquiry(null); fetchInquiries(); }}>
                    &larr; Back to Inbox
                  </button>
                  <ChatWindow 
                    inquiry={activeInquiry} 
                    currentUser={user} 
                    onOfferSent={() => fetchInquiries()} 
                  />
                </div>
              ) : (
                <>
                  <h2>Quotation Inbox</h2>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Buyer</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Offered Price</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.length === 0 ? (
                        <tr><td colSpan="6" style={{textAlign:'center', padding: '20px'}}>No active inquiries.</td></tr>
                      ) : (
                        inquiries.map(inq => (
                          <tr key={inq.id}>
                            <td>{inq.buyer_email}</td>
                            <td>{inq.product_name}</td>
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

          {activeTab === 'dashboard' && (
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Active Inquiries</h3>
                <p className="stat-value">{inquiries.filter(i => i.status !== 'Completed').length}</p>
              </div>
              <div className="stat-card">
                <h3>Finalized Deals</h3>
                <p className="stat-value">{inquiries.filter(i => i.status === 'Completed').length}</p>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="admin-card">
              <div className="card-header" style={{ marginBottom: '20px' }}>
                <h2>Global Inventory Management</h2>
                <div className="inventory-tabs">
                  <button className={`btn ${activeInventoryTab === 'base' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveInventoryTab('base')}>Base Sizes</button>
                  <button className={`btn ${activeInventoryTab === 'color' ? 'btn-primary' : 'btn-outline'}`} style={{ margin: '0 10px' }} onClick={() => setActiveInventoryTab('color')}>Colors</button>
                  <button className={`btn ${activeInventoryTab === 'density' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveInventoryTab('density')}>Densities</button>
                </div>
              </div>
              <table className="admin-table">
                <thead><tr><th>{activeInventoryTab.toUpperCase()} Label</th><th>Quantity</th><th>Action</th></tr></thead>
                <tbody>
                  {inventory.filter(i => i.category === activeInventoryTab).map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.label}</strong></td>
                      <td><span className="status-badge shipped">{item.quantity}</span></td>
                      <td>
                        <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.85rem' }} onClick={() => handleInventoryUpdate(item.id, item.quantity)}>Edit Stock</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="admin-card">
              <div className="card-header"><h2>Add New Product</h2></div>
              <form className="admin-form" onSubmit={handleProductSubmit}>
                {/* Product form identical to previous */}
                <div className="form-group"><label>Product Name</label><input type="text" value={productName} onChange={e => setProductName(e.target.value)} required /></div>
                <div className="form-group"><label>Reference Price ($)</label><input type="number" value={productPrice} onChange={e => setProductPrice(e.target.value)} required /></div>
                <div className="form-group"><label>Description</label><textarea value={productDescription} onChange={e => setProductDescription(e.target.value)} rows="3"></textarea></div>
                <div className="form-group">
                  <label>Product Image (Cloudinary)</label>
                  <div className="upload-zone">
                    {uploadedImageUrl ? <img src={uploadedImageUrl} alt="Uploaded" style={{maxHeight: '150px'}} /> : <><UploadCloud size={32} color="var(--border-muted)" /><input type="file" onChange={handleImageUpload} accept="image/*" /></>}
                    {uploading && <p className="upload-status">Uploading...</p>}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-card">
              <h2>Finalized Deals</h2>
              <table className="admin-table">
                <thead>
                  <tr><th>Order ID</th><th>Buyer</th><th>Product</th><th>Final Price</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {inquiries.filter(i => i.status === 'Completed').map(inq => (
                    <tr key={inq.id}>
                      <td>#DEAL-{inq.id}</td>
                      <td>{inq.buyer_email}</td>
                      <td>{inq.product_name} ({inq.quantity}x)</td>
                      <td>${(inq.final_price * inq.quantity).toFixed(2)}</td>
                      <td><span className="status-badge delivered">Paid & Shipped</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
