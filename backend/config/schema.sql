-- ============================================================
-- Flipkart Clone Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS flipkart_clone;
USE flipkart_clone;

-- ─────────────────────────────────────────────
-- 1. USERS (for authentication)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- 2. CATEGORIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL UNIQUE,
  image_url VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- 2. PRODUCTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  price         DECIMAL(10, 2) NOT NULL,      -- selling price
  mrp           DECIMAL(10, 2) NOT NULL,      -- original price (crossed out)
  rating        DECIMAL(2, 1) DEFAULT 4.0,
  rating_count  INT DEFAULT 0,
  stock         INT DEFAULT 100,
  category_id   INT NOT NULL,
  brand         VARCHAR(100),
  images        JSON,                          -- array of image URLs
  specifications JSON,                         -- key-value spec pairs
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 3. CART ITEMS  (session-based, no login needed)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  session_id  VARCHAR(100) NOT NULL,           -- stored in localStorage
  product_id  INT NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_cart_item (session_id, product_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 4. ORDERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  order_code       VARCHAR(50) NOT NULL UNIQUE,  -- human-readable order ID e.g. OD123456789
  session_id       VARCHAR(100) NOT NULL,
  total_amount     DECIMAL(10, 2) NOT NULL,
  status           ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'confirmed',
  shipping_address JSON NOT NULL,                -- {name, phone, address, city, state, pincode}
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- 5. ORDER ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT NOT NULL,
  product_id  INT NOT NULL,
  quantity    INT NOT NULL,
  price       DECIMAL(10, 2) NOT NULL,          -- price at time of order
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 6. WISHLIST
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  session_id  VARCHAR(100) NOT NULL,
  product_id  INT NOT NULL,
  added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_wishlist_item (session_id, product_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);