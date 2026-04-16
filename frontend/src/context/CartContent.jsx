import React, { createContext, useContext, useState, useEffect } from 'react';
import { addToCart as apiAddToCart, getCart as apiGetCart, removeFromCart as apiRemoveFromCart, updateCartItem as apiUpdateCartItem, clearCart as apiClearCart } from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize sessionId on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    let sid = storedSessionId;
    
    if (!storedSessionId) {
      sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sid);
    }
    
    setSessionId(sid);
    // Load cart from API
    loadCart(sid);
  }, []);

  const loadCart = async (sid) => {
    try {
      setLoading(true);
      const response = await apiGetCart(sid);
      if (response.data.success) {
        setCart(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!sessionId) {
      toast.error('Session not initialized');
      return;
    }

    try {
      const response = await apiAddToCart(sessionId, productId, quantity);
      if (response.data.success) {
        toast.success('Added to cart!');
        // Reload cart from API
        await loadCart(sessionId);
        return true;
      } else {
        toast.error(response.data.message || 'Failed to add to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart');
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await apiRemoveFromCart(itemId);
      if (response.data.success) {
        toast.success('Removed from cart');
        await loadCart(sessionId);
        return true;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error removing from cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return false;

    try {
      const response = await apiUpdateCartItem(itemId, quantity);
      if (response.data.success) {
        await loadCart(sessionId);
        return true;
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Error updating quantity');
      return false;
    }
  };

  const clearCartItems = async () => {
    try {
      const response = await apiClearCart(sessionId);
      if (response.data.success) {
        setCart([]);
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      sessionId,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCartItems,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};