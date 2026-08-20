import React, { useState, useEffect, useRef } from 'react';
import { Paperclip } from 'lucide-react';
import './ChatWindow.css';

const ChatWindow = ({ inquiry, currentUser, onOfferSent, onDealFinalized }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [offerPrice, setOfferPrice] = useState(inquiry.offered_price);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?inquiry_id=${inquiry.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages");
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [inquiry.id]);

  const sendPayload = async (text) => {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inquiry_id: inquiry.id,
        sender_role: currentUser.role,
        sender_name: currentUser.name,
        message: text
      })
    });
    fetchMessages();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await sendPayload(newMessage);
      setNewMessage('');
    } catch (err) {
      alert("Error sending message");
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      // Send the special attachment format
      await sendPayload(`[ATTACHMENT] ${data.url}`);
    } catch (err) {
      alert('File Upload Error: ' + err.message);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendFinalOffer = async () => {
    const finalPrice = parseFloat(offerPrice);
    if (isNaN(finalPrice)) return alert("Invalid price");

    try {
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inquiry.id, status: 'Offer Sent', final_price: finalPrice })
      });
      
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry_id: inquiry.id,
          sender_role: 'system',
          sender_name: 'FIO DE BENGAL',
          message: `ADMIN SENT FINAL OFFER: $${finalPrice.toFixed(2)}`
        })
      });
      
      alert("Final offer sent to buyer!");
      if (onOfferSent) onOfferSent();
    } catch (err) {
      alert("Error sending offer");
    }
  };

  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  const handleFinalizeDeal = async () => {
    if (!shippingAddress.trim()) {
      return alert("Please enter your shipping address to complete the checkout.");
    }
    try {
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inquiry.id, status: 'Completed', shipping_address: shippingAddress })
      });
      
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry_id: inquiry.id,
          sender_role: 'system',
          sender_name: 'System',
          message: `DEAL COMPLETED at $${inquiry.final_price.toFixed(2)}. Shipping to: ${shippingAddress}`
        })
      });
      
      alert("Checkout Successful! Your B2B order has been finalized.");
      setShowCheckout(false);
      if (onDealFinalized) onDealFinalized();
    } catch (err) {
      alert("Error finalizing deal");
    }
  };

  const renderMessageContent = (text) => {
    if (text.startsWith('[ATTACHMENT] ')) {
      const url = text.replace('[ATTACHMENT] ', '');
      const lowerUrl = url.toLowerCase();
      
      if (lowerUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
        return <img src={url} alt="attachment" style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '8px'}} />;
      }
      if (lowerUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
        return <video src={url} controls style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '8px'}} />;
      }
      return <a href={url} target="_blank" rel="noreferrer" style={{textDecoration: 'underline', fontWeight: 'bold'}}>📎 Download Attached File</a>;
    }
    return text;
  };

  return (
    <div className="chat-window-container">
      <div className="chat-header">
        <div className="chat-title">
          <h3>Negotiation: {inquiry.product_name}</h3>
          <p>Specs: {inquiry.base} | {inquiry.color} | {inquiry.density} | Qty: {inquiry.quantity}</p>
        </div>
        <div className="chat-status">
          <span className={`status-badge ${inquiry.status === 'Completed' ? 'delivered' : 'pending'}`}>
            {inquiry.status}
          </span>
        </div>
      </div>
      
      <div className="chat-messages">
        <div className="message system-msg">
          <strong>Initial Offer:</strong> Buyer offered ${Number(inquiry.offered_price).toFixed(2)}
        </div>
        
        {messages.map(msg => {
          const isMe = msg.sender_role === currentUser.role;
          const isSystem = msg.sender_role === 'system';
          return (
            <div key={msg.id} className={`message ${isSystem ? 'system-msg' : isMe ? 'my-msg' : 'their-msg'}`}>
              {!isSystem && <div className="msg-sender">{msg.sender_name}</div>}
              <div className="msg-bubble">{renderMessageContent(msg.message)}</div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {inquiry.status !== 'Completed' && (
        <div className="chat-actions">
          {currentUser.role === 'admin' && inquiry.status !== 'Offer Sent' && (
            <div className="admin-offer-bar">
              <input 
                type="number" 
                value={offerPrice} 
                onChange={e => setOfferPrice(e.target.value)} 
                placeholder="Final Price" 
              />
              <button className="btn btn-primary" onClick={handleSendFinalOffer}>Send Final Offer</button>
            </div>
          )}

          {currentUser.role === 'buyer' && inquiry.status === 'Offer Sent' && (
            <div className="buyer-finalize-bar" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {!showCheckout ? (
                <>
                  <p>Admin sent a final offer of <strong>${Number(inquiry.final_price).toFixed(2)}</strong>.</p>
                  <button className="btn btn-primary" onClick={() => setShowCheckout(true)}>Accept & Checkout</button>
                </>
              ) : (
                <div className="checkout-form" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd' }}>
                  <h4>B2B Checkout</h4>
                  <p style={{marginBottom: '10px'}}>Total Due: <strong>${(inquiry.final_price * inquiry.quantity).toFixed(2)}</strong></p>
                  <div className="form-group">
                    <label>Shipping / Account Information</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      placeholder="Enter full shipping address, company name, and contact details..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                    ></textarea>
                  </div>
                  <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button className="btn btn-outline" onClick={() => setShowCheckout(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleFinalizeDeal}>Submit Payment & Complete</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <form className="chat-input-bar" onSubmit={handleSendMessage}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{display: 'none'}} 
              onChange={handleFileUpload} 
              accept="image/*,video/*,.pdf,.doc,.docx" 
            />
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{padding: '10px'}} 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              title="Attach File"
            >
              {uploadingFile ? "..." : <Paperclip size={18} />}
            </button>
            
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)} 
              disabled={sending || uploadingFile}
            />
            <button type="submit" className="btn btn-outline" disabled={sending || uploadingFile || !newMessage.trim()}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
