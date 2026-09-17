import React, { useEffect } from 'react';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout texture-bengal-wave" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--surface-card)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-gold)', marginBottom: '24px' }}>Privacy Policy</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
          
          <p style={{ marginBottom: '20px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <p style={{ marginBottom: '24px' }}>
            At FIO DE BENGAL LIMITED, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>1. Information We Collect</h3>
          <p style={{ marginBottom: '16px' }}>
            We may collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products, participating in activities on the website, or contacting us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use. The personal information we collect can include the following:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '24px' }}>
            <li>Names, phone numbers, email addresses, and contact preferences.</li>
            <li>Billing addresses, shipping addresses, and payment information (processed securely through third-party providers like PayPal).</li>
          </ul>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>2. How We Use Your Information</h3>
          <p style={{ marginBottom: '16px' }}>
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We use the information we collect or receive:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '24px' }}>
            <li>To fulfill and manage your orders.</li>
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications (if you have opted in).</li>
            <li>To respond to user inquiries and offer support.</li>
          </ul>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>3. Will Your Information Be Shared With Anyone?</h3>
          <p style={{ marginBottom: '24px' }}>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. For example, we share your shipping address with our carrier partners (FedEx, DHL, UPS) solely for the purpose of delivering your order. We also share transaction details securely with payment processors like PayPal to facilitate transactions.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>4. Contact Us</h3>
          <p style={{ marginBottom: '16px' }}>
            If you have questions or comments about this notice, you may email us at info@fiodebengal.com or contact us by post at:
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

export default PrivacyPolicyPage;
