import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPanel from './pages/AdminPanel';
import BuyerPanel from './pages/BuyerPanel';
import TrackingPage from './pages/TrackingPage';
import VerifyPhone from './pages/VerifyPhone';
import RequirePhoneVerification from './components/RequirePhoneVerification';
import './App.css';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/verify-phone');

  return (
    <div className="app-wrapper">
      {!isDashboard && <Navbar />}
      <main style={isDashboard ? { minHeight: '100vh', padding: 0 } : {}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Clerk Auth Routes */}
          <Route path="/login/*" element={<div style={{display:'flex', justifyContent:'center', padding:'40px'}}><SignIn routing="path" path="/login" /></div>} />
          <Route path="/sign-up/*" element={<div style={{display:'flex', justifyContent:'center', padding:'40px'}}><SignUp routing="path" path="/sign-up" /></div>} />
          <Route path="/verify-phone" element={<VerifyPhone />} />
          
          {/* Protected Routes */}
          <Route path="/admin" element={
            <RequirePhoneVerification>
              <AdminPanel />
            </RequirePhoneVerification>
          } />
          <Route path="/dashboard" element={
            <RequirePhoneVerification>
              <BuyerPanel />
            </RequirePhoneVerification>
          } />
          
          <Route path="/tracking" element={<TrackingPage />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <WhatsAppButton />}
    </div>
  );
}

export default App;
