import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCart.css'; // Assuming shared CSS

const ProductCard = ({ product }) => {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.images?.[0] || '/product-placeholder.svg'} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="price">₹{product.price} <span className="mrp">₹{product.mrp}</span> <span className="discount">{discount}% off</span></p>
      </Link>
    </div>
  );
};

export default ProductCard;