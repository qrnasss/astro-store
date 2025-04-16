import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './CheckoutModal.css';
import { supabase } from '../supabaseClient';

// تعيين العنصر الرئيسي للموقع للـ modal
Modal.setAppElement('#root');

const CheckoutModal = ({ isOpen, onClose, cartItems, total, clearCart }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    street: '',
    houseNumber: '',
    paymentMethod: 'cash'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (isCurrentFieldValid()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleCancel = () => {
    if (window.confirm('هل أنت متأكد من إلغاء الطلب؟')) {
      onClose();
      setStep(1);
      setFormData({
        fullName: '',
        phone: '',
        city: '',
        street: '',
        houseNumber: '',
        paymentMethod: 'cash'
      });
    }
  };

  const isCurrentFieldValid = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim().length >= 3;
      case 2:
        return /^[0-9]{8}$/.test(formData.phone);
      case 3:
        return formData.city.trim().length >= 2 && 
               formData.street.trim().length >= 2 && 
               formData.houseNumber.trim().length >= 1;
      case 4:
        return true; // طريقة الدفع دائماً صالحة لأنها radio buttons
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      // Log cart items first
      console.log('Cart Items received:', cartItems);

      // Create the order with all information
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_address_city: formData.city,
          customer_address_street: formData.street,
          customer_address_home: formData.houseNumber,
          payment_method: formData.paymentMethod,
          status: 'confirmed',
          total_price: total,
          create_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        alert('حدث خطأ في إنشاء الطلب: ' + orderError.message);
        return;
      }

      console.log('Order created successfully:', order);

      // Create order items with the correct schema
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      console.log('Attempting to create order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        alert('حدث خطأ في إضافة منتجات الطلب: ' + itemsError.message);
        return;
      }

      // Clear cart and close modal
      clearCart();
      onClose();
      alert('تم تأكيد الطلب بنجاح!');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('حدث خطأ غير متوقع: ' + error.message);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="modal-step">
            <h3>الاسم</h3>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="أدخل اسمك"
              className="modal-input"
            />
          </div>
        );
      case 2:
        return (
          <div className="modal-step">
            <h3>رقم الجوال</h3>
            <input
              type="tel"
              className="modal-input"
              placeholder="رقم الجوال (8 أرقام)"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 8) {
                  setFormData({ ...formData, phone: value });
                }
              }}
              required
            />
          </div>
        );
      case 3:
        return (
          <div className="modal-step">
            <h3>العنوان</h3>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="المدينة"
              className="modal-input"
            />
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="اسم الشارع"
              className="modal-input"
            />
            <input
              type="text"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleInputChange}
              placeholder="رقم المنزل"
              className="modal-input"
            />
          </div>
        );
      case 4:
        return (
          <div className="modal-step">
            <h3>طريقة الدفع</h3>
            <div className="payment-methods">
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleInputChange}
                />
                <span>الدفع عند الاستلام</span>
              </label>
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                />
                <span>بطاقة ائتمان</span>
              </label>
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stcpay"
                  checked={formData.paymentMethod === 'stcpay'}
                  onChange={handleInputChange}
                />
                <span>STC Pay</span>
              </label>
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="applepay"
                  checked={formData.paymentMethod === 'applepay'}
                  onChange={handleInputChange}
                />
                <span>Apple Pay</span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCancel}
      className="checkout-modal"
      overlayClassName="checkout-modal-overlay"
    >
      <div className="modal-header">
        <h2>إتمام الطلب</h2>
        <button onClick={handleCancel} className="close-button">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="modal-content">
        {renderStepContent()}
      </div>

      <div className="modal-footer">
        {step < 4 ? (
          <button 
            onClick={handleNext}
            className="next-button"
            disabled={!isCurrentFieldValid()}
          >
            التالي
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className="submit-button"
          >
            تأكيد الطلب
          </button>
        )}
        {step > 1 && (
          <button onClick={handleBack} className="back-button">
            السابق
          </button>
        )}
        <button onClick={handleCancel} className="cancel-button">
          إلغاء الطلب
        </button>
      </div>
    </Modal>
  );
};

export default CheckoutModal; 