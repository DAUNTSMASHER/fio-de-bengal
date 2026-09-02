import React, { useEffect } from 'react';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout texture-bengal-wave" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--surface-card)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-gold)', marginBottom: '24px' }}>About Fio de Bengal</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '16px' }}>
            Welcome to Fio de Bengal, your premier destination for high-quality, wholesale wigs and hair systems. 
            Rooted in a deep appreciation for craftsmanship, we source only the finest materials to create products 
            that offer unparalleled realism, durability, and comfort.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Our mission is to empower salons, stylists, and retailers around the globe with premium products that 
            their clients will love. We believe that everyone deserves to feel confident, and a great hair system 
            is often the first step.
          </p>
          <p>
            With strict quality control processes and a dedicated support team, we ensure that every order meets 
            our exacting standards. Thank you for choosing Fio de Bengal as your trusted wholesale partner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
