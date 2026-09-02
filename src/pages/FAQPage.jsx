import React, { useEffect } from 'react';

const FAQPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    { q: "What is the minimum order quantity (MOQ)?", a: "As a wholesale provider, our standard MOQ is 10 units per order. However, we offer sample orders for new partners." },
    { q: "How long does shipping take?", a: "Standard international shipping typically takes 7-14 business days. Expedited shipping via DHL/FedEx is available and usually takes 3-5 business days." },
    { q: "Do you offer custom manufacturing?", a: "Yes, we can produce custom hair systems tailored to your exact specifications, including base size, hair density, color, and wave pattern." },
    { q: "What is your return policy?", a: "We accept returns on defective merchandise within 30 days of receipt. Custom orders cannot be returned unless there is a manufacturing defect." }
  ];

  return (
    <div className="page-layout texture-bengal-wave" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--surface-card)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-gold)', marginBottom: '32px' }}>Frequently Asked Questions</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '1.2rem' }}>{faq.q}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
