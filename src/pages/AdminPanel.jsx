import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Users, LogOut, UploadCloud, Archive, MessageSquare, MapPin } from 'lucide-react';
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
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [products, setProducts] = useState([
    { id: 1, name: 'Hollywood' }, { id: 2, name: 'BMW' }, { id: 3, name: 'Mono' },
    { id: 4, name: 'Mono Front Lace' }, { id: 5, name: 'Australia' }, { id: 6, name: 'Full Lace' }
  ]);
  const [editingInventory, setEditingInventory] = useState(null);

  // Negotiations State
  const [inquiries, setInquiries] = useState([]);
  const [activeInquiry, setActiveInquiry] = useState(null);

  // Tracking State
  const [trackings, setTrackings] = useState([]);
  const [trackingForm, setTrackingForm] = useState({ order_no: '', quantity: '', value: '', delivery_country: '', carrier: 'FedEx' });
  const [updateForm, setUpdateForm] = useState({ order_no: '', new_status: '', location: '', message: '' });
  const [showCreateTracking, setShowCreateTracking] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetch(`/api/inventory?product_id=${selectedProductId}&t=${new Date().getTime()}`)
        .then(res => res.json())
        .then(data => setInventory(data || []))
        .catch(err => console.error(err));
        
      fetchInquiries();
      fetchTrackings();
    }
  }, [user, selectedProductId]);

  const fetchTrackings = async () => {
    try {
      const res = await fetch(`/api/tracking?t=${new Date().getTime()}`);
      const data = await res.json();
      setTrackings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`/api/inquiries?t=${new Date().getTime()}`);
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
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

  const handleCreateTracking = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...trackingForm, quantity: Number(trackingForm.quantity), value: Number(trackingForm.value) })
      });
      if (!res.ok) throw new Error('Failed to create tracking');
      setTrackingForm({ order_no: '', quantity: '', value: '', delivery_country: '', carrier: 'FedEx' });
      setShowCreateTracking(false);
      fetchTrackings();
      alert('Tracking created!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateTracking = async (e) => {
    e.preventDefault();
    if (!updateForm.order_no) return alert('Select an order to update');
    try {
      const res = await fetch('/api/tracking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm)
      });
      if (!res.ok) throw new Error('Failed to update tracking');
      setUpdateForm({ order_no: '', new_status: '', location: '', message: '' });
      fetchTrackings();
      alert('Tracking updated!');
    } catch (err) {
      alert(err.message);
    }
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
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Package size={20} /> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'negotiations' ? 'active' : ''}`} onClick={() => { setActiveTab('negotiations'); setActiveInquiry(null); fetchInquiries(); }}>
            <MessageSquare size={20} /> Negotiations
          </button>
          <button className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <Archive size={20} /> Inventory
          </button>
          <button className={`nav-item ${activeTab === 'tracking' ? 'active' : ''}`} onClick={() => setActiveTab('tracking')}>
            <MapPin size={20} /> Tracking
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
                            <td>
                              <strong>{inq.product_name}</strong>
                      {inquiries.map(inq => (
                        <tr key={inq.id}>
                          <td>{inq.buyer_email}</td>
                          <td>
                            <strong>{inq.product_name}</strong>
                            <br/>
                            <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                              {inq.base} | {inq.color} | {inq.length} {inq.model_variant ? `| Var: ${inq.model_variant}` : ''}
                            </span>
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
                      ))}
                    </tbody>
                  </table>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Active Orders</h3>
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
              <div className="card-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Model Inventory</h2>
                <select 
                  className="form-control" 
                  style={{ width: '250px', padding: '10px' }}
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{margin: 0}}>SKU Combinations</h3>
                <button className="btn btn-outline" style={{padding: '8px 16px', fontSize: '14px'}}>+ Add Variation</button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Base Size</th>
                    <th>Length</th>
                    <th>Color</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.base_size}</td>
                      <td>{item.length}</td>
                      <td>{item.color}</td>
                      <td>
                        {editingInventory === item.id ? (
                          <input 
                            type="text" 
                            defaultValue={item.quantity}
                            id={`inv-input-${item.id}`}
                            style={{ width: '80px', padding: '4px' }}
                          />
                        ) : (
                          <span className="status-badge shipped">{item.quantity}</span>
                        )}
                      </td>
                      <td>
                        {editingInventory === item.id ? (
                          <button 
                            className="btn btn-primary" 
                            style={{padding: '4px 12px', fontSize: '12px'}}
                            onClick={() => {
                              const newVal = document.getElementById(`inv-input-${item.id}`).value;
                              handleInventoryUpdate(item.id, newVal);
                              setEditingInventory(null);
                            }}
                          >
                            Save
                          </button>
                        ) : (
                          <button 
                            className="btn btn-outline"
                            style={{padding: '4px 12px', fontSize: '12px'}}
                            onClick={() => setEditingInventory(item.id)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr><td colSpan="5" style={{textAlign: 'center'}}>No inventory variants found for this product.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="admin-card">
              <div className="card-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Tracking Management</h2>
                <button className="btn btn-primary" onClick={() => setShowCreateTracking(!showCreateTracking)}>
                  {showCreateTracking ? 'Cancel' : '+ Create Shipment'}
                </button>
              </div>

              {showCreateTracking && (
                <form className="admin-form" onSubmit={handleCreateTracking} style={{background: '#fafafa', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
                  <h3>Create New Shipment</h3>
                  <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                    <div className="form-group" style={{flex: 1}}><label>Order No</label><input type="text" value={trackingForm.order_no} onChange={e => setTrackingForm({...trackingForm, order_no: e.target.value})} required /></div>
                    <div className="form-group" style={{flex: 1}}><label>Quantity</label><input type="number" value={trackingForm.quantity} onChange={e => setTrackingForm({...trackingForm, quantity: e.target.value})} required /></div>
                    <div className="form-group" style={{flex: 1}}><label>Total Value ($)</label><input type="number" step="0.01" value={trackingForm.value} onChange={e => setTrackingForm({...trackingForm, value: e.target.value})} required /></div>
                    <div className="form-group" style={{flex: 1}}><label>Destination Country</label><input type="text" value={trackingForm.delivery_country} onChange={e => setTrackingForm({...trackingForm, delivery_country: e.target.value})} required /></div>
                    <div className="form-group" style={{flex: 1}}><label>Carrier</label>
                      <select className="form-control" value={trackingForm.carrier} onChange={e => setTrackingForm({...trackingForm, carrier: e.target.value})}>
                        <option value="FedEx">FedEx</option>
                        <option value="DHL">DHL</option>
                        <option value="UPS">UPS</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Create Shipment Record</button>
                </form>
              )}

              <div style={{background: '#fafafa', padding: '20px', borderRadius: '8px', marginBottom: '30px'}}>
                <h3>Add Tracking Update</h3>
                <form onSubmit={handleUpdateTracking} style={{display: 'flex', gap: '15px', alignItems: 'flex-end', marginTop: '15px'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Select Order</label>
                    <select className="form-control" value={updateForm.order_no} onChange={e => setUpdateForm({...updateForm, order_no: e.target.value})} required>
                      <option value="">Select...</option>
                      {trackings.map(t => <option key={t.id} value={t.order_no}>{t.order_no}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>New Status (Short)</label>
                    <input type="text" placeholder="e.g. In Transit" value={updateForm.new_status} onChange={e => setUpdateForm({...updateForm, new_status: e.target.value})} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Location</label>
                    <input type="text" placeholder="e.g. NY Hub" value={updateForm.location} onChange={e => setUpdateForm({...updateForm, location: e.target.value})} required />
                  </div>
                  <div className="form-group" style={{flex: 2}}>
                    <label>Detailed Message</label>
                    <input type="text" placeholder="e.g. Package arrived at local carrier facility" value={updateForm.message} onChange={e => setUpdateForm({...updateForm, message: e.target.value})} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{padding: '12px 24px'}}>Update</button>
                </form>
              </div>

              <h3>Active Shipments</h3>
              <table className="admin-table">
                <thead>
                  <tr><th>Order No</th><th>Carrier</th><th>Destination</th><th>Qty</th><th>Value</th><th>Current Status</th><th>Last Updated</th></tr>
                </thead>
                <tbody>
                  {trackings.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.order_no}</strong></td>
                      <td>{t.carrier || 'FedEx'}</td>
                      <td>{t.delivery_country}</td>
                      <td>{t.quantity}</td>
                      <td>${Number(t.value).toFixed(2)}</td>
                      <td><span className="status-badge pending">{t.current_status}</span></td>
                      <td>{new Date(t.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                  {trackings.length === 0 && (
                    <tr><td colSpan="7" style={{textAlign: 'center'}}>No shipments tracked yet.</td></tr>
                  )}
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
                  <tr><th>Order ID</th><th>Buyer</th><th>Product</th><th>Final Price</th><th>Shipping Info</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {inquiries.filter(i => i.status === 'Completed').map(inq => (
                    <tr key={inq.id}>
                      <td>#DEAL-{inq.id}</td>
                      <td>{inq.buyer_email}</td>
                      <td>{inq.product_name} ({inq.quantity}x)</td>
                      <td>${(inq.final_price * inq.quantity).toFixed(2)}</td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{inq.shipping_address || 'N/A'}</td>
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
