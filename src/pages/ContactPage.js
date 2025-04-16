import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا سيتم إرسال البيانات إلى الخادم
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>اتصل بنا</h1>
        <p>نحن هنا لمساعدتك ونرحب بتواصلك معنا</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>معلومات التواصل</h2>
          
          <div className="info-item">
            <FontAwesomeIcon icon={faPhone} />
            <div>
              <h3>اتصل بنا</h3>
              <p>+966 50 000 0000</p>
            </div>
          </div>

          <div className="info-item">
            <FontAwesomeIcon icon={faEnvelope} />
            <div>
              <h3>راسلنا</h3>
              <p>info@example.com</p>
            </div>
          </div>

          <div className="info-item">
            <FontAwesomeIcon icon={faLocationDot} />
            <div>
              <h3>موقعنا</h3>
              <p>الرياض، المملكة العربية السعودية</p>
            </div>
          </div>

          <div className="info-item">
            <FontAwesomeIcon icon={faClock} />
            <div>
              <h3>ساعات العمل</h3>
              <p>السبت - الخميس: 9:00 صباحاً - 11:00 مساءً</p>
              <p>الجمعة: 2:00 مساءً - 11:00 مساءً</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2>أرسل رسالة</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">الاسم</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">رقم الجوال</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">الموضوع</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">الرسالة</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              إرسال الرسالة
            </button>
          </form>
        </div>
      </div>

      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463880.6834872434!2d46.54075592500001!3d24.725555099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1635959025!5m2!1sen!2s"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="موقعنا"
        />
      </div>
    </div>
  );
}

export default ContactPage; 