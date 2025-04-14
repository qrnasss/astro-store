import React, { useState } from 'react';

function Cart() {
  const [cartItems] = useState([]);

  return (
    <div className="cart">
      <h2 className="mb-4">سلة المشتريات</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-info">السلة فارغة</div>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">السعر: {item.price} ريال</p>
                <p className="card-text">الكمية: {item.quantity}</p>
                <button className="btn btn-danger btn-sm">حذف</button>
              </div>
            </div>
          ))}
          <div className="total mt-3">
            <h4>المجموع: 0 ريال</h4>
            <button className="btn btn-success">إتمام الشراء</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart; 