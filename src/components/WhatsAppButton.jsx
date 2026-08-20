import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/1234567890" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="whatsapp-btn"
      aria-label="Chat with us on WhatsApp"
    >
      <img src="/design_assets/fio_whatsapp_icon.png" className="custom-icon whatsapp-icon" alt="WhatsApp" />
    </a>
  );
};

export default WhatsAppButton;
