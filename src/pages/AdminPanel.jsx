import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Users, LogOut, UploadCloud } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploading, setUploading] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

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
      alert('Image successfully uploaded to Cloudinary!');
    } catch (err) {
      alert('Upload Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !productPrice) return alert("Name and price are required");

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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      alert("Product saved to database successfully!");
      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setUploadedImageUrl('');
    } catch (err) {
      alert("Error saving product: " + err.message);
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
          <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <ShoppingCart size={20} /> Products
          </button>
          <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <Users size={20} /> Orders
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
          {activeTab === 'dashboard' && (
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Sales</h3>
                <p className="stat-value">$12,450</p>
              </div>
              <div className="stat-card">
                <h3>Active Orders</h3>
                <p className="stat-value">14</p>
              </div>
              <div className="stat-card">
                <h3>Total Products</h3>
                <p className="stat-value">24</p>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="admin-card">
              <div className="card-header">
                <h2>Add New Product</h2>
              </div>
              <form className="admin-form" onSubmit={handleProductSubmit}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input type="text" placeholder="e.g. Raw Bengal Wavy Bundle" value={productName} onChange={e => setProductName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" placeholder="150" value={productPrice} onChange={e => setProductPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea placeholder="Product description..." value={productDescription} onChange={e => setProductDescription(e.target.value)} rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>Product Image (Cloudinary)</label>
                  <div className="upload-zone">
                    {uploadedImageUrl ? (
                       <img src={uploadedImageUrl} alt="Uploaded" style={{maxHeight: '150px'}} />
                    ) : (
                      <>
                        <UploadCloud size={32} color="var(--border-muted)" />
                        <p>Drag and drop image here, or click to browse</p>
                        <input type="file" onChange={handleImageUpload} accept="image/*" />
                      </>
                    )}
                    {uploading && <p className="upload-status">Uploading to Cloudinary...</p>}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-card">
              <h2>Recent Orders</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#ORD-001</td>
                    <td>Jane Doe</td>
                    <td>Oct 12, 2024</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td>$450.00</td>
                  </tr>
                  <tr>
                    <td>#ORD-002</td>
                    <td>Sarah Smith</td>
                    <td>Oct 11, 2024</td>
                    <td><span className="status-badge shipped">Shipped</span></td>
                    <td>$120.00</td>
                  </tr>
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
