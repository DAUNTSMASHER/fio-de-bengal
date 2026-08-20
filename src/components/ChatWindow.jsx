import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ inquiry, currentUser, onOfferSent, onDealFinalized }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [offerPrice, setOfferPrice] = useState(inquiry.offered_price);
  
  const chatEndRef = useRef(null);

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

  // Poll for new messages every 3 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [inquiry.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry_id: inquiry.id,
          sender_role: currentUser.role,
          sender_name: currentUser.name,
          message: newMessage
        })
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      alert("Error sending message");
    } finally {
      setSending(false);
    }
  };

  const handleSendFinalOffer = async () => {
    const finalPrice = parseFloat(offerPrice);
    if (isNaN(finalPrice)) return alert("Invalid price");

    try {
      // 1. Update Inquiry Status
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inquiry.id, status: 'Offer Sent', final_price: finalPrice })
      });
      
      // 2. Send System Message
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

  const handleFinalizeDeal = async () => {
    try {
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inquiry.id, status: 'Completed' })
      });
      
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry_id: inquiry.id,
          sender_role: 'system',
          sender_name: 'System',
          message: `DEAL FINALIZED at $${inquiry.final_price.toFixed(2)}. Proceeding to checkout/fulfillment.`
        })
      });
      
      alert("Deal Finalized! Redirecting to checkout...");
      if (onDealFinalized) onDealFinalized();
    } catch (err) {
      alert("Error finalizing deal");
    }
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
              <div className="msg-bubble">{msg.message}</div>
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
            <div className="buyer-finalize-bar">
              <p>Admin sent a final offer of <strong>${Number(inquiry.final_price).toFixed(2)}</strong>.</p>
              <button className="btn btn-primary" onClick={handleFinalizeDeal}>Finalize & Checkout</button>
            </div>
          )}

          <form className="chat-input-bar" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)} 
              disabled={sending}
            />
            <button type="submit" className="btn btn-outline" disabled={sending || !newMessage.trim()}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
