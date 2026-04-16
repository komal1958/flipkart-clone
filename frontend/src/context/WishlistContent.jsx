import React, { createContext, useContext, useState, useEffect } from 'react';
import { addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist, getWishlist as apiGetWishlist } from '../services/api';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children, sessionId }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadWishlist();
    }
  }, [sessionId]);

  const loadWishlist = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const response = await apiGetWishlist(sessionId);
      if (response.data.success) {
        setWishlist(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!sessionId) {
      toast.error('Session not initialized');
      return false;
    }

    try {
      const response = await apiAddToWishlist(sessionId, productId);
      if (response.data.success) {
        toast.success('Added to wishlist');
        await loadWishlist();
        return true;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!sessionId) {
      toast.error('Session not initialized');
      return false;
    }

    try {
      const response = await apiRemoveFromWishlist(sessionId, productId);
      if (response.data.success) {
        toast.success('Removed from wishlist');
        await loadWishlist();
        return true;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return false;
    }
  };

  const toggleWishlist = async (productId) => {
    if (isWishlisted(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted
    }}>
      {children}
    </WishlistContext.Provider>
  );
};