import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const cartCount = getCartCount();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getProfileLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo-group" style={{textDecoration: 'none'}}>
          <div className="navbar-logo">
            <img src="/design_assets/fio_generated_tiger_logo.png" alt="Tiger Icon" className="logo-img" />
          </div>
          <div className="navbar-brand-text">
            <span className="brand-fio-de">FIO DE</span>
            <span className="brand-bengal">BENGAL</span>
          </div>
        </Link>
        
        <nav className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>HOME</Link>
          <Link to="/products" onClick={() => setIsOpen(false)}>PRODUCTS</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)}>BLOG</Link>
          <Link to="/tracking" onClick={() => setIsOpen(false)}>TRACKING</Link>
          
          <Link to="/cart" className="cart-icon-wrapper" onClick={() => setIsOpen(false)}>
            <ShoppingBag size={24} color="var(--text-primary)" strokeWidth={1.5} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <Link to={getProfileLink()} className="auth-icon-wrapper" onClick={() => setIsOpen(false)} style={{marginLeft: '8px', display: 'flex', alignItems: 'center', color: 'var(--text-primary)'}}>
            <User size={24} strokeWidth={1.5} />
          </Link>
        </nav>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
