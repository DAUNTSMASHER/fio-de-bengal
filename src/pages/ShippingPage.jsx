import React, { useEffect } from 'react';

const ShippingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout texture-bengal-wave" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--surface-card)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-gold)', marginBottom: '24px' }}>Shipping Policy</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>Order Processing</h3>
          <p style={{ marginBottom: '16px' }}>
            All wholesale orders for stock items are processed within 1-2 business days. Custom manufacturing orders 
            will have their processing times communicated during the quotation phase (typically 4-6 weeks).
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>Shipping Methods</h3>
          <p style={{ marginBottom: '16px' }}>
            We partner with premier global carriers including FedEx, DHL, and UPS to ensure safe and timely delivery 
            of your high-value wholesale shipments. Shipping costs are calculated based on the dimensional weight of 
            your order and the destination country.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>Customs, Duties, and Taxes</h3>
          <p style={{ marginBottom: '16px' }}>
            Fio de Bengal is not responsible for any customs and taxes applied to your order. All fees imposed during 
            or after shipping are the responsibility of the customer (tariffs, taxes, etc.). Please check with your 
            local customs office for rates.
          </p>
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>Tracking Your Order</h3>
          <p>
            Once your order ships, you will receive a shipping confirmation email containing your tracking number(s). 
            You can also use the Tracking page on our website to monitor the status of your shipment in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
