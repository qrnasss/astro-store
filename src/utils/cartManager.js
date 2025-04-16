// وظائف إدارة السلة
export const getCart = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

// إضافة منتج إلى السلة
export const addToCart = (product) => {
  try {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    // إرسال حدث لتحديث السلة
    const event = new Event('cartUpdated');
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

// تحديث كمية منتج في السلة
export const updateQuantity = (productId, quantity) => {
  try {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      // إرسال حدث لتحديث السلة
      const event = new Event('cartUpdated');
      document.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};

// حذف منتج من السلة
export const removeFromCart = (productId) => {
  try {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    // إرسال حدث لتحديث السلة
    const event = new Event('cartUpdated');
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

// حساب المجموع الكلي للسلة
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// حساب عدد المنتجات في السلة
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// تفريغ السلة بالكامل
export const clearCart = () => {
  try {
    localStorage.setItem('cart', JSON.stringify([]));
    // إرسال حدث لتحديث السلة
    const event = new Event('cartUpdated');
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}; 