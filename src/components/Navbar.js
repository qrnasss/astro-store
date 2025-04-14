import React, { useState } from 'react';
import logo from '../assets/logo.png';
import './Navbar.css';

function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navStyle = {
    color: '#8B0000',
    fontSize: '1.4rem',
    fontWeight: '900',
    marginBottom: '0',
    padding: '0.15rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  };

  const cartDropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    borderRadius: '8px',
    width: '320px',
    padding: '1rem',
    zIndex: 1000,
    marginTop: '0.5rem'
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" 
      style={{ 
        padding: '0',
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        margin: '0.5rem',
        backgroundColor: 'white',
        minHeight: '65px'
      }}>
      <div className="container" style={{ minHeight: '65px' }}>
        <div className="d-flex order-1 position-relative">
          <button 
            className="btn position-relative" 
            style={{
              ...navStyle,
              transform: 'scale(1.2)',
              margin: '0 0.5rem'
            }}
            onClick={() => setIsCartOpen(!isCartOpen)}
            onMouseEnter={() => setIsCartOpen(true)}
          >
            <i className="fas fa-shopping-cart fa-lg"></i>
          </button>
          
          {isCartOpen && (
            <div 
              style={cartDropdownStyle} 
              onClick={e => e.stopPropagation()}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <div className="cart-items mb-3">
                <div className="text-center text-muted py-4">
                  السلة فارغة
                </div>
              </div>
              <div className="d-grid gap-2">
                <button className="btn cart-button cart-button-outline">
                  عرض السلة
                </button>
                <button className="btn cart-button cart-button-filled">
                  إتمام الشراء
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="collapse navbar-collapse justify-content-center order-2" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link mx-3" href="/">الصفحة الرئيسية</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-3" href="/products">المنتجات</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-3" href="/about">من نحن</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-3" href="/contact">اتصل بنا</a>
            </li>
          </ul>
        </div>

        <div className="navbar-brand order-3">
          <a href="/">
            <img src={logo} alt="Logo" className="navbar-logo" style={{ height: '75px', marginTop: '-20px', marginBottom: '-20px' }} />
          </a>
        </div>

        <button 
          className="navbar-toggler order-2" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ 
            padding: '0.15rem',
            transform: 'scale(1.1)',
            margin: '0 0.5rem'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 