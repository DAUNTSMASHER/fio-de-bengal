import React, { useState } from 'react';
import { Search, Package, MapPin, CheckCircle2, Clock } from 'lucide-react';
import './TrackingPage.css';

const TrackingPage = () => {
  const [orderNo, setOrderNo] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const dummyOrders = [
    { id: 'FIO-89234', quantity: 15, value: 3450.00, carrier: 'FedEx', destination: 'United States', status: 'In Transit', time: '2 mins ago', color: '#f59e0b' },
    { id: 'FIO-44192', quantity: 5, value: 1150.00, carrier: 'DHL', destination: 'United Kingdom', status: 'Out for Delivery', time: '14 mins ago', color: '#3b82f6' },
    { id: 'FIO-99210', quantity: 50, value: 10500.00, carrier: 'UPS', destination: 'Australia', status: 'Delivered', time: '1 hour ago', color: '#10b981' },
    { id: 'FIO-11029', quantity: 2, value: 480.00, carrier: 'FedEx', destination: 'Canada', status: 'Customs Clearance', time: '3 hours ago', color: '#8b5cf6' },
    { id: 'FIO-77341', quantity: 10, value: 2200.00, carrier: 'DHL', destination: 'Germany', status: 'Dispatched', time: '5 hours ago', color: '#6366f1' },
    { id: 'FIO-22948', quantity: 8, value: 1840.00, carrier: 'UPS', destination: 'France', status: 'Delivered', time: '1 day ago', color: '#10b981' }
  ];

  const countryToFlag = (country) => {
    if (!country) return '🌍';
    const map = {
      'United States': '🇺🇸', 'USA': '🇺🇸', 'US': '🇺🇸',
      'United Kingdom': '🇬🇧', 'UK': '🇬🇧',
      'Australia': '🇦🇺',
      'Canada': '🇨🇦',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'India': '🇮🇳',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'South Korea': '🇰🇷',
      'Netherlands': '🇳🇱',
      'Switzerland': '🇨🇭',
      'Sweden': '🇸🇪',
      'Singapore': '🇸🇬',
      'UAE': '🇦🇪', 'United Arab Emirates': '🇦🇪',
      'Saudi Arabia': '🇸🇦',
      'Bangladesh': '🇧🇩',
      'New Zealand': '🇳🇿'
    };
    return map[country] || '🌍';
  };

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

  const CarrierLogo = ({ carrier, size = 'small' }) => {
    if (carrier === 'FedEx') {
      return (
        <div style={{
          background: '#4d148c', 
          display: 'inline-flex', 
          alignItems: 'center',
          padding: size === 'large' ? '4px 12px' : '3px 10px',
          borderRadius: '2px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: '900',
          fontSize: size === 'large' ? '28px' : '20px',
          letterSpacing: '-1.5px',
          lineHeight: 1,
          verticalAlign: 'middle'
        }}>
          <span style={{color: 'white'}}>Fed</span>
          <span style={{color: '#ff6600'}}>Ex</span>
        </div>
      );
    }
    
    if (carrier === 'DHL') {
      return <img src="https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg" alt="DHL" style={{height: size === 'large' ? '32px' : '22px', objectFit: 'contain', verticalAlign: 'middle'}} />;
    }
    
    if (carrier === 'UPS') {
      return <img src="https://www.ups.com/assets/resources/images/UPS_logo.svg" alt="UPS" style={{height: size === 'large' ? '42px' : '30px', objectFit: 'contain', verticalAlign: 'middle'}} />;
    }
    
    return <span>{carrier}</span>;
  };

  return (
    <div className="tracking-page texture-bengal-wave">
      <div className="container">
        <div className="tracking-header">
          <h1>Order Tracking</h1>
          <p>Track your FIO DE BENGAL shipments in real-time.</p>
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
                <span className="summary-label">Carrier</span>
                <span className="summary-value">
                  <CarrierLogo carrier={trackingData.carrier} size="large" />
                </span>
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
                <span className="summary-value">
                  <span style={{fontSize: '1.2em', marginRight: '6px'}}>{countryToFlag(trackingData.delivery_country)}</span>
                  {trackingData.delivery_country}
                </span>
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

      {!trackingData && (
        <div className="live-dummy-orders-wrapper">
          <div className="live-dummy-orders">
            <h3 className="live-orders-title">
              <div className="pulsing-dot"></div> Live Shipments
            </h3>
            <div className="dummy-orders-list-container">
              <table className="dummy-orders-table">
                <thead>
                  <tr>
                    <th>Order No</th>
                    <th>Carrier</th>
                    <th>Quantity</th>
                    <th>Total Value</th>
                    <th>Country</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyOrders.map((order, idx) => (
                    <tr key={idx}>
                      <td><strong>{order.id}</strong></td>
                      <td>
                        <CarrierLogo carrier={order.carrier} size="small" />
                      </td>
                      <td>{order.quantity} Units</td>
                      <td>${order.value.toFixed(2)}</td>
                      <td>
                        <span style={{fontSize: '1.2em', marginRight: '6px'}}>{countryToFlag(order.destination)}</span>
                        {order.destination}
                      </td>
                      <td style={{color: order.color, fontWeight: 600}}>{order.status}</td>
                      <td style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
