import React, { useState } from 'react';
import { Search, Package, MapPin, CheckCircle2, Clock } from 'lucide-react';
import './TrackingPage.css';

const TrackingPage = () => {
  const [orderNo, setOrderNo] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNo.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);
    
    try {
      const res = await fetch(`/api/tracking?order_no=${encodeURIComponent(orderNo.trim())}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Order number not found. Please check and try again.');
        }
        throw new Error('Error retrieving tracking details. Please try again later.');
      }
      const data = await res.json();
      setTrackingData(data);
    } catch (err) {
      setError(err.message);
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracking-page texture-bengal-wave">
      <div className="container">
        <div className="tracking-header">
          <h1>Global Order Tracking</h1>
          <p>Track your FIO DE BENGAL shipments globally in real-time.</p>
        </div>

        <div className="tracking-search-card">
          <form onSubmit={handleSearch} className="tracking-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={24} />
              <input
                type="text"
                placeholder="Enter your Order No (e.g. FIO-12345)"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                className="tracking-input"
              />
            </div>
            <button type="submit" className="tracking-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {error && (
          <div className="tracking-error">
            <p>{error}</p>
          </div>
        )}

        {trackingData && (
          <div className="tracking-results-card">
            <div className="tracking-summary">
              <div className="summary-item">
                <span className="summary-label">Order No</span>
                <span className="summary-value">{trackingData.order_no}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Quantity</span>
                <span className="summary-value">{trackingData.quantity} Units</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Order Value</span>
                <span className="summary-value">${Number(trackingData.value).toFixed(2)} USD</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Destination</span>
                <span className="summary-value">{trackingData.delivery_country}</span>
              </div>
              <div className="summary-item status-highlight">
                <span className="summary-label">Current Status</span>
                <span className="summary-value highlight">{trackingData.current_status}</span>
              </div>
            </div>

            <div className="tracking-timeline-container">
              <h3>Shipping History</h3>
              {trackingData.tracking_history && trackingData.tracking_history.length > 0 ? (
                <div className="timeline">
                  {trackingData.tracking_history.map((evt, idx) => (
                    <div className="timeline-item" key={idx}>
                      <div className="timeline-marker">
                        {idx === 0 ? <CheckCircle2 size={20} color="var(--accent-gold)" /> : <Clock size={20} color="var(--text-secondary)" />}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-date">{new Date(evt.date).toLocaleString()}</div>
                        <div className="timeline-message">{evt.message}</div>
                        <div className="timeline-location">
                          <MapPin size={14} /> {evt.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No tracking updates available yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
