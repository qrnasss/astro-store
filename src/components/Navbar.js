import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faSearch, faHeart, faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getCart, getCartTotal, removeFromCart } from '../utils/cartManager';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    updateCartInfo();
    
    // إضافة مستمع للتغييرات في localStorage
    const handleStorageChange = () => {
      updateCartInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const updateCartInfo = () => {
    const items = getCart();
    setCartItems(items);
    setCartTotal(getCartTotal());
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    updateCartInfo();
    // إرسال حدث لتحديث السلة في جميع المكونات
    const event = new Event('cartUpdated');
    document.dispatchEvent(event);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Desktop Icons */}
        <div className="nav-icons desktop-icons">
          <button className="nav-icon-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button className="nav-icon-button">
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <div className="cart-dropdown">
            <Link to="/cart" className="nav-icon-button cart-icon">
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartItems.length > 0 && (
                <span className="cart-count">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
            {/* Cart Dropdown Content */}
            <div className="cart-dropdown-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart-message">السلة فارغة</div>
              ) : (
                <>
                  <div className="cart-items-preview">
                    {cartItems.slice(0, 3).map(item => (
                      <div key={item.id} className="cart-preview-item">
                        <img src={item.image_url} alt={item.name} />
                        <div className="preview-item-details">
                          <h4>{item.name}</h4>
                          <p>{item.price} ر.س × {item.quantity}</p>
                        </div>
                        <button 
                          className="remove-item-button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveItem(item.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <div className="more-items">
                        +{cartItems.length - 3} منتجات أخرى
                      </div>
                    )}
                  </div>
                  <div className="cart-preview-total">
                    <span>المجموع:</span>
                    <span>{cartTotal.toFixed(2)} ر.س</span>
                  </div>
                  <Link to="/cart" className="view-cart-button">
                    عرض السلة
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>الرئيسية</Link>
          <Link to="/products" onClick={() => setIsOpen(false)}>المنتجات</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>من نحن</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>اتصل بنا</Link>
          {/* Mobile Icons */}
          <div className="nav-icons mobile-only">
            <button className="nav-icon-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <button className="nav-icon-button">
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <Link to="/cart" className="nav-icon-button cart-icon" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartItems.length > 0 && (
                <span className="cart-count">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>

        <Link to="/" className="logo">
          <img src={logo} alt="Logo" height="40" />
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 