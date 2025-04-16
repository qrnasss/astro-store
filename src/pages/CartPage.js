import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateQuantity, clearCart } from '../utils/cartManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import CheckoutModal from '../components/CheckoutModal';
import './CartPage.css';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const items = getCart();
    setCartItems(items);
    calculateTotal(items);
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    loadCartItems();
  };

  const handleQuantityChange = (productId, change) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity);
        loadCartItems();
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    loadCartItems();
  };

  return (
    <div className="cart-page">
      <h2>سلة التسوق</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>سلة التسوق فارغة</h2>
          <p>لم تقم بإضافة أي منتجات إلى السلة بعد</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image_url} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">{item.price} ريال</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
                <div className="item-total">
                  {(item.price * item.quantity).toFixed(2)} ريال
                </div>
                <button 
                  className="remove-item" 
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total">
              <span>المجموع:</span>
              <span>{total.toFixed(2)} ريال</span>
            </div>
            <button 
              className="checkout-button"
              onClick={() => setIsModalOpen(true)}
            >
              إتمام الطلب
            </button>
          </div>
        </>
      )}

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cartItems={cartItems}
        total={total}
        clearCart={clearCart}
      />
    </div>
  );
}

export default CartPage; 