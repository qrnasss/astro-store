import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        return;
      }

      console.log('Fetched products:', data); // Debug log
      setProducts(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return;
      }

      fetchProducts();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>المنتجات</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img 
              src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} 
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">{product.price} ريال</p>
            <div className="button-group">
              <div className={product.is_available === true ? 'status-available' : 'status-unavailable'}>
                {product.is_available === true ? 'متوفر' : 'غير متوفر'}
              </div>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(product.id)}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 