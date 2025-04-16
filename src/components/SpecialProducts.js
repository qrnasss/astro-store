import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './SpecialProducts.css';
import { addToCart } from '../utils/cartManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function SpecialProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    });
    
    // إظهار تأكيد الإضافة للسلة
    setAddedToCart(product.id);
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="special-products-section">
      <div className="special-products-container">
        <div className="special-products-header">
          <h2 className="special-products-title">منتجات خاصة</h2>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="product-image-container">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                <div className={`product-overlay ${hoveredProduct === product.id ? 'visible' : ''}`}>
                  <button 
                    className={`add-to-cart-button ${addedToCart === product.id ? 'added' : ''}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.is_available}
                  >
                    {addedToCart === product.id ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} />
                        <span>تمت الإضافة</span>
                      </>
                    ) : (
                      'أضف إلى السلة'
                    )}
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price} ر.س</p>
                <p className={`product-availability ${product.is_available ? 'available' : 'unavailable'}`}>
                  {product.is_available ? 'متوفر' : 'غير متوفر'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpecialProducts; 