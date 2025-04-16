import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }
    setError('');
    // TODO: Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <div className="newsletter-container">
      <div className="newsletter-content">
        <h2>اشتركي في نشرتنا البريدية</h2>
        <p>احصلي على آخر العروض والأخبار عن أحدث المنتجات</p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="البريد الإلكتروني"
            required
            className="newsletter-input"
          />
          <button type="submit" className="newsletter-button">اشتراك</button>
        </form>
        {error && <p className="newsletter-error">{error}</p>}
      </div>
    </div>
  );
};

export default Newsletter; 