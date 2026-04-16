import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContent';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">🤍</div>
            <h2>Your wishlist is empty</h2>
            <p>Add items you like to your wishlist</p>
            <Link to="/" className="shop-now-btn">Continue Shopping</Link>
          </div>
        ) : (
          <div className="wishlist-items">
            {wishlist.map((item) => (
              <div key={item.product_id} className="wishlist-item">
                <Link to={`/product/${item.product_id}`} className="wishlist-item-link">
                  <div className="wishlist-item-image">
                    <img 
                      src={item.images?.[0] || '/product-placeholder.svg'} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="wishlist-item-info">
                    <h3>{item.name}</h3>
                    <p className="wishlist-item-brand">{item.brand}</p>
                    <div className="wishlist-item-price">
                      <span className="price">₹{item.price?.toLocaleString()}</span>
                      <span className="mrp">₹{item.mrp?.toLocaleString()}</span>
                      <span className="discount">
                        {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% off
                      </span>
                    </div>
                  </div>
                </Link>
                <button 
                  className="remove-wishlist-btn"
                  onClick={() => removeFromWishlist(item.product_id)}
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;