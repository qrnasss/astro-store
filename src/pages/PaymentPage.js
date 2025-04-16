import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { GoSell } from '@tap-payments/gosell';
import { supabase } from '../supabaseClient';
import './PaymentPage.css';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('processing'); // 'processing', 'success', 'failed'
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Get order ID from URL params or state
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || (location.state && location.state.orderId);
    
    if (id) {
      setOrderId(id);
      fetchOrderDetails(id);
    } else {
      // No order ID provided
      setPaymentStatus('failed');
    }
  }, [location]);

  const fetchOrderDetails = async (id) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setOrderDetails(data);
      // Initialize payment after getting order details
      initializePayment(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setPaymentStatus('failed');
    }
  };

  const initializePayment = (order) => {
    if (!order) return;

    const tapPaymentConfig = {
      gateway: {
        publicKey: 'pk_test_YOUR_TAP_PUBLIC_KEY', // استبدل بمفتاح API الخاص بك
        language: 'ar',
        supportedCurrencies: 'all',
        supportedPaymentMethods: 'all',
        saveCardOption: false,
        customerCards: false,
        notifications: 'standard',
        callback: handlePaymentCallback,
        labels: {
          cardNumber: 'رقم البطاقة',
          expirationDate: 'تاريخ الانتهاء',
          cvv: 'رمز التحقق',
          cardHolder: 'اسم حامل البطاقة',
          actionButton: 'إتمام الدفع'
        },
        style: {
          base: {
            color: '#535353',
            lineHeight: '18px',
            fontFamily: 'sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: 'rgba(0, 0, 0, 0.26)',
              fontSize: '15px'
            }
          },
          invalid: {
            color: 'red',
            iconColor: '#fa755a'
          }
        }
      },
      customer: {
        first_name: order.customer_name?.split(' ')[0] || 'العميل',
        last_name: order.customer_name?.split(' ').slice(1).join(' ') || '',
        email: order.customer_email || 'customer@example.com',
        phone: {
          country_code: '966',
          number: order.customer_phone || '00000000'
        }
      },
      order: {
        amount: order.total_price,
        currency: 'SAR',
        items: order.order_items?.map(item => ({
          id: item.product_id,
          name: item.name || 'منتج',
          description: 'وصف المنتج',
          quantity: item.quantity,
          amount_per_unit: item.price_at_time
        })) || []
      },
      transaction: {
        mode: 'charge',
        charge: {
          saveCard: false,
          threeDSecure: true,
          description: `طلب رقم: ${order.id}`,
          statement_descriptor: 'Astro Store',
          reference: {
            transaction: `t-${Date.now()}`,
            order: order.id
          },
          post: {
            url: window.location.origin + '/payment/callback'
          },
          redirect: {
            url: window.location.origin + `/payment/result?orderId=${order.id}`
          }
        }
      }
    };

    GoSell.openLightBox(tapPaymentConfig);
  };

  const handlePaymentCallback = (response) => {
    console.log('Payment response:', response);

    if (response.status === 'CAPTURED' || response.status === 'AUTHORIZED') {
      // Payment successful
      setPaymentStatus('success');
      updateOrderStatus('paid');
    } else {
      // Payment failed
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
            <h2>جاري معالجة الدفع...</h2>
            <p>يرجى الانتظار حتى اكتمال العملية</p>
          </div>
        );
      case 'success':
        return (
          <div className="payment-status success">
            <FontAwesomeIcon icon={faCheckCircle} />
            <h2>تم الدفع بنجاح!</h2>
            <p>تم تأكيد طلبك وسيتم شحنه قريباً</p>
            <button onClick={() => navigate('/')}>العودة للصفحة الرئيسية</button>
          </div>
        );
      case 'failed':
        return (
          <div className="payment-status failed">
            <FontAwesomeIcon icon={faTimesCircle} />
            <h2>فشلت عملية الدفع</h2>
            <p>حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.</p>
            <button onClick={() => navigate('/cart')}>العودة لسلة التسوق</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="payment-page">
      <div className="container">
        <h1>إتمام الدفع</h1>
        
        {orderDetails && (
          <div className="order-summary">
            <h2>ملخص الطلب</h2>
            <div className="order-info">
              <p><strong>رقم الطلب:</strong> {orderId}</p>
              <p><strong>المجموع:</strong> {orderDetails.total_price} ريال</p>
            </div>
          </div>
        )}
        
        <div className="payment-container">
          <div id="tap-payment-container"></div>
          {renderPaymentStatus()}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage; 