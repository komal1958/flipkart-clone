import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCart';
import './HomePage.css';

const CATEGORY_ICONS = {
  'Mobiles': '/category-mobiles.svg',
  'Electronics': '/category-electronics.svg',
  'Fashion': '/category-fashion.svg',
  'Home & Furniture': '/category-home.svg',
  'Appliances': '/category-appliances.svg',
  'Books': '/category-books.svg',
};

const getCategoryImage = (category) => {
  if (category.image_url) return category.image_url;
  return CATEGORY_ICONS[category.name] || '/category-electronics.svg';
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('');

  const searchQuery = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data?.data || []))
      .catch((error) => {
        console.error('Error loading categories:', error);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (activeCategory) params.category = activeCategory;
    if (sortBy) params.sort = sortBy;

    getProducts(params)
      .then(res => {
        setProducts(res.data?.data || []);
      })
      .catch((error) => {
        console.error('Error loading products:', error);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchQuery, activeCategory, sortBy]);

  const handleCategory = (catName) => {
    if (catName === activeCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="home-page">
      {/* Category Strip */}
      <div className="category-strip">
        <div className="category-strip-inner">
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleCategory(cat.name)}
            >
              <div className="cat-img-wrap">
                <img src={getCategoryImage(cat)} alt={cat.name} />
              </div>
              <span className="cat-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      {!searchQuery && !activeCategory && (
        <div className="hero-banner">
          <div className="banner-slide">
            <div className="banner-content">
              <h2>Big Billion Days Sale</h2>
              <p>Up to 80% off on top brands</p>
              <button onClick={() => setSearchParams({ category: 'Electronics' })} className="banner-cta">
                Shop Now
              </button>
            </div>
            <div className="banner-graphic">🛍️</div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="products-section">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Filters</h3>

            <div className="filter-group">
              <p className="filter-label">CATEGORY</p>
              {categories.map(cat => (
                <label key={cat.id} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={activeCategory === cat.name}
                    onChange={() => handleCategory(cat.name)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
              {activeCategory && (
                <button
                  className="clear-filter-btn"
                  onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="filter-group">
              <p className="filter-label">SORT BY</p>
              {[
                { value: '', label: 'Relevance' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'rating', label: 'Best Rating' },
              ].map(opt => (
                <label key={opt.value} className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === opt.value}
                    onChange={() => setSortBy(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="products-main">
          {/* Result header */}
          <div className="results-header">
            {searchQuery && <h2 className="results-title">Results for "<strong>{searchQuery}</strong>"</h2>}
            {activeCategory && !searchQuery && <h2 className="results-title">{activeCategory}</h2>}
            {!searchQuery && !activeCategory && <h2 className="results-title">All Products</h2>}
            <span className="results-count">{products.length} products</span>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="no-results">
              <div style={{ fontSize: 64 }}>😕</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <Link to="/" className="go-home-btn">Go to Home</Link>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;