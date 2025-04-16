import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './CheckoutModal.css';
import { supabase } from '../supabaseClient';
import { GoSell } from '@tap-payments/gosell';

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
    paymentMethod: 'card'
  });
  const [paymentStatus, setPaymentStatus] = useState(''); // 'processing', 'success', 'failed', ''
  const [orderId, setOrderId] = useState(null);

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
        paymentMethod: 'card'
      });
      setPaymentStatus('');
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

      setPaymentStatus('processing');

      // Convert total to a fixed numeric value (remove any chance of string input)
      const numericTotal = Math.round(parseFloat(total) * 100) / 100;
      console.log('Total price for order (validated):', numericTotal);
      
      if (isNaN(numericTotal) || numericTotal <= 0) {
        console.error('Invalid total:', total);
        alert('قيمة الطلب غير صالحة');
        setPaymentStatus('');
        return;
      }

      // Create the order with all information
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_address_city: formData.city,
          customer_address_street: formData.street,
          customer_address_home: formData.houseNumber,
          payment_method: 'card',
          status: 'pending',
          total_price: numericTotal,
          create_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        alert('حدث خطأ في إنشاء الطلب: ' + orderError.message);
        setPaymentStatus('failed');
        return;
      }

      console.log('Order created successfully:', order);
      setOrderId(order.id);

      // Create order items with validated numeric values
      const orderItems = cartItems.map(item => {
        const quantity = Math.max(1, Math.round(Number(item.quantity)));
        const price = Math.round(parseFloat(item.price) * 100) / 100;
        
        return {
          order_id: order.id,
          product_id: item.id,
          quantity: quantity,
          price_at_time: price
        };
      });

      console.log('Creating order items with validated values:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        alert('حدث خطأ في إضافة منتجات الطلب: ' + itemsError.message);
        setPaymentStatus('failed');
        return;
      }

      // Initialize Tap payment
      initializePayment(order, numericTotal);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('حدث خطأ غير متوقع: ' + error.message);
      setPaymentStatus('failed');
    }
  };

  const initializePayment = (order, numericTotal) => {
    if (!order) return;

    try {
      // Prepare redirect URL with order ID
      const redirectUrl = `${window.location.origin}?order_id=${order.id}`;
      console.log('Redirect URL:', redirectUrl);
      
      // Create a form to redirect to Tap payment page
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', 'https://secure.tap.company/v2/checkout');
      form.setAttribute('target', '_self');
      
      // Add hidden fields
      const addHiddenField = (name, value) => {
        const field = document.createElement('input');
        field.setAttribute('type', 'hidden');
        field.setAttribute('name', name);
        field.setAttribute('value', value);
        form.appendChild(field);
      };
      
      // Add required fields
      addHiddenField('amount', numericTotal);
      addHiddenField('currency', 'SAR');
      addHiddenField('customer_first_name', order.customer_name.split(' ')[0] || 'العميل');
      addHiddenField('customer_last_name', order.customer_name.split(' ').slice(1).join(' ') || '');
      addHiddenField('customer_phone', order.customer_phone);
      addHiddenField('customer_email', 'customer@example.com');
      addHiddenField('source_id', 'src_card');
      addHiddenField('return_url', redirectUrl);
      addHiddenField('post_url', redirectUrl);
      addHiddenField('description', `طلب رقم ${order.id}`);
      addHiddenField('order_id', order.id);
      addHiddenField('public_key', 'pk_test_q7QYhDmy5tIZfRs9SgOlrjVi');
      
      // Append form to the document and submit
      document.body.appendChild(form);
      console.log('Submitting payment form to Tap...');
      
      // Add the form to the payment container for visibility
      const container = document.getElementById('tap-payment-container');
      if (container) {
        container.innerHTML = '';
        container.appendChild(form);
      }
      
      // Submit the form after a short delay
      setTimeout(() => {
        form.submit();
      }, 1000);
      
    } catch (error) {
      console.error('Error initializing payment:', error);
      setPaymentStatus('failed');
    }
  };

  // Add useEffect to set a fallback timer for processing state
  useEffect(() => {
    let timer;
    // If processing for more than 30 seconds, show error
    if (paymentStatus === 'processing') {
      timer = setTimeout(() => {
        if (paymentStatus === 'processing') {
          console.log('Payment processing timeout');
          setPaymentStatus('failed');
        }
      }, 30000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [paymentStatus]);

  const handlePaymentCallback = (response) => {
    console.log('Payment response received:', response);

    if (!response) {
      console.error('Empty payment response');
      setPaymentStatus('failed');
      updateOrderStatus('payment_failed');
      return;
    }

    if (response.status === 'CAPTURED' || response.status === 'AUTHORIZED') {
      // Payment successful
      console.log('Payment successful');
      setPaymentStatus('success');
      updateOrderStatus('paid');
      setTimeout(() => {
        clearCart();
        onClose();
        alert('تم الدفع بنجاح! سيتم شحن طلبك قريباً.');
      }, 1500);
    } else {
      // Payment failed
      console.log('Payment failed with status:', response.status);
      setPaymentStatus('failed');
      updateOrderStatus('payment_failed');
    }
  };

  const updateOrderStatus = async (status) => {
    if (!orderId) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: status })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <div className="payment-status processing">
            <FontAwesomeIcon icon={faSpinner} spin />
            <h2>جاري تجهيز صفحة الدفع...</h2>
            <p>سيتم تحويلك إلى صفحة الدفع خلال لحظات</p>
            <p>إذا لم يتم التحويل تلقائياً، اضغط على الزر أدناه</p>
            <button 
              className="payment-button" 
              onClick={() => {
                const container = document.getElementById('tap-payment-container');
                if (container && container.querySelector('form')) {
                  container.querySelector('form').submit();
                }
              }}
            >
              الانتقال لصفحة الدفع
            </button>
          </div>
        );
      case 'success':
        return (
          <div className="payment-status success">
            <FontAwesomeIcon icon={faCheckCircle} />
            <h2>تم الطلب بنجاح!</h2>
            <p>تم تأكيد طلبك وسيتم شحنه قريباً</p>
          </div>
        );
      case 'failed':
        return (
          <div className="payment-status failed">
            <FontAwesomeIcon icon={faTimesCircle} />
            <h2>فشلت العملية</h2>
            <p>حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.</p>
            <button className="retry-button" onClick={() => setPaymentStatus('')}>المحاولة مرة أخرى</button>
          </div>
        );
      default:
        return null;
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
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Checkout Modal"
      className="checkout-modal"
      overlayClassName="checkout-overlay"
    >
      <button className="close-button" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <h2 className="modal-title">إتمام الطلب</h2>

      {paymentStatus ? (
        <div className="payment-status-container">
          {renderPaymentStatus()}
          <div id="tap-payment-container"></div>
        </div>
      ) : (
        <>
          <div className="modal-content">
            {renderStepContent()}
          </div>

          <div className="modal-footer">
            {step < 3 ? (
              <button 
                onClick={handleNext}
                className={`next-button ${isCurrentFieldValid() ? 'valid' : 'disabled'}`}
                disabled={!isCurrentFieldValid()}
              >
                التالي
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="submit-button"
              >
                الانتقال للدفع
              </button>
            )}
            
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="back-button"
              >
                السابق
              </button>
            )}
            
            <button 
              onClick={handleCancel}
              className="cancel-button"
            >
              إلغاء
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default CheckoutModal; 