import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://flipkart-clone-xcqw.onrender.com/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const placeOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const getOrderHistory = async () => {
  try {
    const response = await api.get('/orders');
    return response;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

// Cart API functions
export const getCart = async (sessionId) => {
  try {
    const response = await api.get(`/cart/${sessionId}`);
    return response;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (sessionId, productId, quantity = 1) => {
  try {
    const response = await api.post('/cart', { sessionId, productId, quantity });
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async (sessionId) => {
  try {
    const response = await api.delete(`/cart/clear/${sessionId}`);
    return response;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Wishlist API functions
export const getWishlist = async (sessionId) => {
  try {
    const response = await api.get(`/wishlist/${sessionId}`);
    return response;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const addToWishlist = async (sessionId, productId) => {
  try {
    const response = await api.post('/wishlist', { sessionId, productId });
    return response;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (sessionId, productId) => {
  try {
    const response = await api.delete(`/wishlist/${sessionId}/${productId}`);
    return response;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const updateProductImages = async (productId, images) => {
  try {
    const response = await api.put(`/products/${productId}/images`, { images });
    return response;
  } catch (error) {
    console.error('Error updating product images:', error);
    throw error;
  }
};

// Authentication API functions
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};