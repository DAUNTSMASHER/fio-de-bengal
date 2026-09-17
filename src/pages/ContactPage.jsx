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
            <p style={{ marginBottom: '8px' }}><strong>Email:</strong> info@fiodebengal.com</p>
            <p style={{ marginBottom: '8px' }}><strong>WhatsApp:</strong> +44 7454 735807</p>
            <p style={{ marginBottom: '24px' }}><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (EST)</p>
            
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', borderTop: '1px solid var(--border-muted)', paddingTop: '24px' }}>Company Information</h3>
            <p style={{ marginBottom: '8px' }}><strong>Company Name:</strong> FIO DE BENGAL LIMITED</p>
            <p style={{ marginBottom: '8px' }}><strong>Company Number:</strong> 17460327</p>
            <p style={{ marginBottom: '8px' }}><strong>Registered Address & Stock Location:</strong></p>
            <p style={{ marginBottom: '8px', paddingLeft: '16px', borderLeft: '2px solid var(--accent-gold)' }}>
              OFFICE 21091, 182-184 HIGH STREET NORTH<br />
              EAST HAM, LONDON<br />
              UNITED KINGDOM E6 2JA
            </p>
            
            <div style={{ marginTop: '20px', marginBottom: '16px' }}>
              <a 
                href="/documents/fio_de_bengal_incorporation_certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                View Certificate of Incorporation
              </a>
            </div>

            <p style={{ marginTop: '16px', fontSize: '0.95rem', color: 'var(--accent-gold)' }}>
              <em>* All our stock is securely held and dispatched directly from our UK address for fast and reliable shipping.</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
