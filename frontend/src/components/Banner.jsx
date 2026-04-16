import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Welcome to Flipkart Clone</h1>
        <p>Your one-stop shop for everything!</p>
        <button className="btn btn-primary">Shop Now</button>
      </div>
      <div className="banner-image">
        <img src="/banner-hero.svg" alt="Big Billion Days Sale" />
      </div>
    </div>
  );
};

export default Banner;