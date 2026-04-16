import { useState, useEffect } from 'react';
import { getProducts, updateProductImages } from '../services/api';
import './AdminProductsPage.css';

const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  const name = product.name?.toLowerCase() || '';
  if (name.includes('rich dad') || name.includes('poor dad')) {
    return '/rich-dad.webp';
  }
  return '/product-placeholder.svg';
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingImages, setEditingImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const startEditingImages = (productId, currentImages) => {
    setEditingId(productId);
    setEditingImages(currentImages || []);
    setNewImageUrl({ [productId]: '' });
  };

  const addImageToProduct = (productId) => {
    const url = newImageUrl[productId]?.trim();
    if (!url) {
      alert('Please enter a valid image URL or use the local rich dad image path.');
      return;
    }

    // Check if URL is valid
    if (!url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
      alert('Please enter a valid image URL (must end with .jpg, .png, .gif, or .webp)');
      return;
    }

    setEditingImages([...editingImages, url]);
    setNewImageUrl({ ...newImageUrl, [productId]: '' });
  };

  const removeImageFromProduct = (index) => {
    setEditingImages(editingImages.filter((_, i) => i !== index));
  };

  const saveProductImages = async (productId) => {
    if (editingImages.length === 0) {
      alert('Product must have at least one image');
      return;
    }

    try {
      const response = await updateProductImages(productId, editingImages);
      const data = response.data;

      if (data.success) {
        alert('Product images updated successfully!');
        setEditingId(null);
        loadProducts();
      } else {
        alert('Failed to update images: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating product images:', error);
      alert('Error updating product images');
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingImages({});
    setNewImageUrl({});
  };

  if (loading) {
    return <div className="admin-page"><div className="spinner" style={{ marginTop: 80 }} /></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>📸 Product Image Manager</h1>
        <p className="subtitle">Add, edit, and manage product images for all your products</p>

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card-admin">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <span className="product-id">ID: {product.id}</span>
                </div>

                {editingId === product.id ? (
                  // EDIT MODE
                  <div className="edit-mode">
                    <h4>Edit Product Images</h4>

                    {/* Current Images */}
                    {editingImages.length > 0 && (
                      <div className="current-images">
                        <h5>Current Images ({editingImages.length})</h5>
                        <div className="images-list">
                          {editingImages.map((img, idx) => (
                            <div key={idx} className="image-item">
                              <img src={img} alt={`Product ${idx + 1}`} />
                              <button
                                className="remove-btn"
                                onClick={() => removeImageFromProduct(idx)}
                                type="button"
                              >
                                ✕ Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Image */}
                    <div className="add-image-form">
                      <h5>Add New Image URL</h5>
                      <div className="input-group">
                        <input
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          value={newImageUrl[product.id] || ''}
                          onChange={(e) =>
                            setNewImageUrl({ ...newImageUrl, [product.id]: e.target.value })
                          }
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addImageToProduct(product.id);
                            }
                          }}
                        />
                        <button
                          className="btn-add-image"
                          onClick={() => addImageToProduct(product.id)}
                        >
                          + Add Image
                        </button>
                      </div>
                      <p className="hint">
                        ✓ Paste direct image URLs (must be .jpg, .png, .gif, or .webp)
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="edit-actions">
                      <button
                        className="btn-save"
                        onClick={() => saveProductImages(product.id)}
                      >
                        ✓ Save Images
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={cancelEditing}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <div className="view-mode">
                    {/* Current Images Preview */}
                    <div className="images-preview">
                      <div className="main-image">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/product-placeholder.svg';
                          }}
                        />
                      </div>
                      {product.images && product.images.length > 1 ? (
                        <div className="thumbnail-list">
                          {product.images.slice(1, 4).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Thumbnail ${idx + 2}`}
                              className="thumbnail"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/product-placeholder.svg';
                              }}
                            />
                          ))}
                          {product.images.length > 4 && (
                            <div className="thumbnail more">
                              +{product.images.length - 4} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="no-images">
                          <p>❌ No images added yet</p>
                          <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                            Showing placeholder image for now.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="image-count">
                      📸 {product.images?.length || 0} image{product.images?.length !== 1 ? 's' : ''}
                    </div>

                    {/* Info */}
                    <div className="product-info">
                      <p><strong>Brand:</strong> {product.brand}</p>
                      <p><strong>Price:</strong> ₹{product.price}</p>
                      <p><strong>Stock:</strong> {product.stock} units</p>
                    </div>

                    {/* Edit Button */}
                    <button
                      className="btn-edit"
                      onClick={() => startEditingImages(product.id, product.images || [])}
                    >
                      ✏️ Edit Images
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
