import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContent';
import { useWishlist } from '../context/WishlistContent';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cartItemCount = cart?.length || 0;
  const wishlistItemCount = wishlist?.length || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo */}
        <Link to="/" className="navbar-brand">
        <div className="navbar-logo">
          <img src="/logo.svg" alt="Flipkart Clone" />
        </div>
        </Link>

        {/* Search Bar */}
        <div className="navbar-search">
          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/orders" className="nav-link">Orders</Link>
          <Link to="/admin/products" className="nav-link">Admin</Link>
        </div>

        {/* User Actions */}
        <div className="navbar-actions">
          {/* Wishlist */}
          <Link to="/wishlist" className="action-btn" title="Wishlist">
            <i className="fas fa-heart"></i>
            {wishlistItemCount > 0 && (
              <span className="wishlist-badge">{wishlistItemCount}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="action-btn" title="Cart">
            <i className="fas fa-shopping-cart"></i>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>

          {/* User Menu */}
          <div className="user-menu">
            <button className="user-btn" onClick={toggleUserMenu}>
              <div className="user-avatar">
                <img src="/avatar-placeholder.svg" alt="User Avatar" />
              </div>
              <span>{user ? user.name : 'Login'}</span>
              <i className="fas fa-chevron-down"></i>
            </button>

            {isUserMenuOpen && (
              <div className="user-menu-dropdown">
                {user ? (
                  <>
                    <Link to="/profile" className="dropdown-item" onClick={toggleUserMenu}>
                      <i className="fas fa-user"></i>
                      My Profile
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={toggleUserMenu}>
                      <i className="fas fa-cog"></i>
                      Settings
                    </Link>
                    <button
                      className="dropdown-item logout-btn"
                      onClick={() => {
                        logout();
                        toggleUserMenu();
                        navigate('/');
                      }}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item" onClick={toggleUserMenu}>
                      <i className="fas fa-sign-in-alt"></i>
                      Login
                    </Link>
                    <Link to="/signup" className="dropdown-item" onClick={toggleUserMenu}>
                      <i className="fas fa-user-plus"></i>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-menu-item" onClick={toggleMobileMenu}>
              <i className="fas fa-home"></i>
              Home
            </Link>
            <Link to="/orders" className="mobile-menu-item" onClick={toggleMobileMenu}>
              <i className="fas fa-shopping-bag"></i>
              Orders
            </Link>
            <Link to="/wishlist" className="mobile-menu-item" onClick={toggleMobileMenu}>
              <i className="fas fa-heart"></i>
              Wishlist ({wishlistItemCount})
            </Link>
            <Link to="/cart" className="mobile-menu-item" onClick={toggleMobileMenu}>
              <i className="fas fa-shopping-cart"></i>
              Cart ({cartItemCount})
            </Link>
            <Link to="/admin/products" className="mobile-menu-item" onClick={toggleMobileMenu}>
              <i className="fas fa-tools"></i>
              Admin
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="mobile-menu-item" onClick={toggleMobileMenu}>
                  <i className="fas fa-user"></i>
                  My Profile
                </Link>
                <Link to="/settings" className="mobile-menu-item" onClick={toggleMobileMenu}>
                  <i className="fas fa-cog"></i>
                  Settings
                </Link>
                <button
                  className="mobile-menu-item logout-btn"
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                    navigate('/');
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu-item" onClick={toggleMobileMenu}>
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </Link>
                <Link to="/signup" className="mobile-menu-item" onClick={toggleMobileMenu}>
                  <i className="fas fa-user-plus"></i>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;