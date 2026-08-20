import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import BuyerPanel from './pages/BuyerPanel';
import './App.css';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  return (
    <div className="app-wrapper">
      {!isDashboard && <Navbar />}
      <main style={isDashboard ? { minHeight: '100vh', padding: 0 } : {}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/dashboard" element={<BuyerPanel />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <WhatsAppButton />}
    </div>
  );
}

export default App;
