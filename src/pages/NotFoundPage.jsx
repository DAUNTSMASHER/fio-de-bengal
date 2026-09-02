import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout texture-bengal-wave" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '6rem', fontFamily: 'Georgia, serif', color: 'var(--accent-gold)', marginBottom: '0' }}>404</h1>
        <h2 style={{ fontSize: '2rem', fontFamily: 'Georgia, serif', color: 'var(--text-primary)', marginBottom: '20px' }}>Page Not Found</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
          We couldn't find the page you were looking for. It might have been moved, or the link you followed might be broken.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ padding: '12px 30px' }}>
            Return Home
          </Link>
          <Link to="/products" className="btn btn-outline" style={{ padding: '12px 30px' }}>
            Shop Wholesale
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
