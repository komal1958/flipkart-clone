import React from 'react';
import './Category.css';

const Category = ({ categories }) => {
  return (
    <div className="categories">
      <h2>Shop by Category</h2>
      <div className="category-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card card">
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;