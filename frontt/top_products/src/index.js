import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import ProductCard from './ProductCard';
import Filter from './Filter';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/categories/categoryname/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h1>Top Products</h1>
      <Filter />
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Home;