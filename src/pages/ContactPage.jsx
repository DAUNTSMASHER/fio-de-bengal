import React, { useEffect } from 'react';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout texture-bengal-wave" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--surface-card)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-gold)', marginBottom: '24px' }}>Contact Us</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '24px' }}>
            We're here to help! Whether you have questions about our products, need assistance with a wholesale order, 
            or want to track a shipment, our team is ready to assist you.
          </p>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Get in Touch</h3>
            <p style={{ marginBottom: '8px' }}><strong>Email:</strong> support@fiodebengal.com</p>
            <p style={{ marginBottom: '8px' }}><strong>WhatsApp:</strong> +1 (555) 123-4567</p>
            <p style={{ marginBottom: '8px' }}><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (EST)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
