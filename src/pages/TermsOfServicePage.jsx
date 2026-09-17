import React, { useEffect } from 'react';

const TermsOfServicePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout texture-bengal-wave" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--surface-card)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-gold)', marginBottom: '24px' }}>Terms of Service</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
          
          <p style={{ marginBottom: '20px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <p style={{ marginBottom: '24px' }}>
            Welcome to FIO DE BENGAL LIMITED ("we", "our", or "us"). These Terms of Service govern your use of fiodebengal.com and the purchase of our premium wholesale wigs. 
            By accessing or using our website, you agree to be bound by these Terms of Service.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>1. Wholesale Accounts and Purchasing</h3>
          <p style={{ marginBottom: '16px' }}>
            Fio de Bengal is a B2B supplier catering to salons, retailers, and hair loss clinics. By creating an account and placing an order, you confirm that you are purchasing goods for business or resale purposes. 
            As a company, we source premium products directly from our trusted suppliers to guarantee quality for our partners. 
            We reserve the right to refuse service or terminate accounts at our sole discretion.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>2. Pricing and Payments</h3>
          <p style={{ marginBottom: '16px' }}>
            All prices are listed in USD unless otherwise noted. We are actively implementing secure payment gateways such as PayPal. Currently, direct payments via the website are temporarily paused, and orders must be finalized via our sales team on WhatsApp. 
            We reserve the right to modify prices at any time without prior notice.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>3. Shipping and Returns</h3>
          <p style={{ marginBottom: '16px' }}>
            Our shipping and return policies are outlined in detail on our <a href="/shipping" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>Shipping & Returns Policy</a> page. 
            Please note that our 21-day refund policy is an exclusive privilege granted strictly to loyal partners who have actively maintained a business relationship with us for a minimum of 2 years.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>4. Intellectual Property</h3>
          <p style={{ marginBottom: '24px' }}>
            All content included on this site, such as text, graphics, logos, images, and software, is the property of FIO DE BENGAL LIMITED or its content suppliers and protected by international copyright laws.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>5. Contact Information</h3>
          <p style={{ marginBottom: '16px' }}>
            Questions about the Terms of Service should be sent to us at info@fiodebengal.com or by mail to:
          </p>
          <p style={{ paddingLeft: '16px', borderLeft: '2px solid var(--accent-gold)' }}>
            FIO DE BENGAL LIMITED<br />
            OFFICE 21091, 182-184 HIGH STREET NORTH<br />
            EAST HAM, LONDON<br />
            UNITED KINGDOM E6 2JA
          </p>

        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
