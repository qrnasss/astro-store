import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>تواصل معنا</h3>
          <div className="social-links">
            <a href="#" className="social-link">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a href="#" className="social-link">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a href="#" className="social-link">
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>روابط سريعة</h3>
          <ul className="quick-links">
            <li><Link to="/" onClick={scrollToTop}>الرئيسية</Link></li>
            <li><Link to="/products" onClick={scrollToTop}>المنتجات</Link></li>
            <li><Link to="/about" onClick={scrollToTop}>من نحن</Link></li>
            <li><Link to="/contact" onClick={scrollToTop}>اتصل بنا</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>معلومات التواصل</h3>
          <ul className="contact-info">
            <li>الهاتف: +966 XX XXX XXXX</li>
            <li>البريد: info@example.com</li>
            <li>العنوان: المملكة العربية السعودية</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>جميع الحقوق محفوظة © 2024</p>
      </div>
    </footer>
  );
};

export default Footer; 