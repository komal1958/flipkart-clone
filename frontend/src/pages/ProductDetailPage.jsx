import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContent';
import { useWishlist } from '../context/WishlistContent';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(res => {
        setProduct(res.data.data);
        setSelectedImg(0);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) {
      toast.error('Product not loaded');
      return;
    }

    setAddingToCart(true);
    try {
      const success = await addToCart(product.id, quantity);
      if (success) {
        setQuantity(1); // Reset quantity after adding
      }
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) {
      toast.error('Product not loaded');
      return;
    }

    setAddingToCart(true);
    try {
      const success = await addToCart(product.id, quantity);
      if (success) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error in handleBuyNow:', error);
      toast.error('Failed to proceed');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!product) return null;

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const productName = product.name?.toLowerCase() || '';
  const richDadImage = '/rich-dad.webp';
  const baseImages = product.images?.length ? [...product.images] : ['/product-placeholder.svg'];
  const images = productName.includes('rich dad') || productName.includes('poor dad')
    ? [richDadImage, ...baseImages.filter(img => img !== richDadImage)]
    : baseImages;
  const specs = product.specifications || {};
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* ── Left: Image Gallery ── */}
        <div className="detail-gallery">
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Thumbnails */}
            <div className="thumbnail-strip">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumbnail ${selectedImg === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImg(idx)}
                >
                  <img src={img} alt={`thumb-${idx}`} />
                </div>
              ))}
            </div>

            {/* Main image */}
            <div className="main-image-wrap">
              <img src={images[selectedImg]} alt={product.name} className="main-image" />
            </div>
          </div>

          {/* Action buttons (desktop sticky) */}
          <div className="gallery-actions">
            <button
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : '🛒 ADD TO CART'}
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={addingToCart || product.stock === 0}
            >
              ⚡ BUY NOW
            </button>
          </div>

          {/* Wishlist link below buttons */}
          <div className="wishlist-toggle-wrap">
            <button
              className={`wishlist-toggle-btn ${wishlisted ? 'wishlisted' : ''}`}
              onClick={() => toggleWishlist(product.id)}
            >
              {wishlisted ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </div>

        {/* ── Right: Product Info ── */}
        <div className="detail-info">
          <p className="detail-brand">{product.brand}</p>
          <h1 className="detail-title">{product.name}</h1>

          {/* Rating row */}
          <div className="detail-rating-row">
            <span className="detail-rating-badge">{product.rating} ★</span>
            <span className="detail-rating-count">{product.rating_count?.toLocaleString()} ratings</span>
            <span className="detail-rating-sep">|</span>
            <span className="detail-brand-tag">{product.category_name}</span>
          </div>

          <hr className="divider" />

          {/* Price */}
          <div className="detail-price-section">
            <span className="detail-price">₹{product.price?.toLocaleString()}</span>
            <span className="detail-mrp">₹{product.mrp?.toLocaleString()}</span>
            <span className="detail-discount">{discount}% off</span>
          </div>

          {/* Offers */}
          <div className="offers-section">
            <p className="offers-title">Available offers</p>
            <div className="offer-item">
              <span className="offer-tag">Bank Offer</span>
              <span>10% off on HDFC Bank Credit Cards. T&C apply</span>
            </div>
            <div className="offer-item">
              <span className="offer-tag">Special Price</span>
              <span>Get extra {discount}% off (price inclusive of cashback/coupon)</span>
            </div>
            <div className="offer-item">
              <span className="offer-tag">No Cost EMI</span>
              <span>₹{Math.round(product.price / 6).toLocaleString()}/month. Standard EMI also available</span>
            </div>
          </div>

          {/* Stock */}
          <div className="stock-status">
            {product.stock > 0
              ? <span className="in-stock">✓ In Stock ({product.stock} units)</span>
              : <span className="out-of-stock">✗ Out of Stock</span>
            }
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="quantity-section">
              <span className="qty-label">Quantity:</span>
              <div className="qty-controls">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
              </div>
            </div>
          )}

          {/* Mobile buttons */}
          <div className="mobile-actions">
            <button className="btn-add-cart" onClick={handleAddToCart} disabled={addingToCart || product.stock === 0}>
              🛒 ADD TO CART
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow} disabled={addingToCart || product.stock === 0}>
              ⚡ BUY NOW
            </button>
          </div>

          <hr className="divider" />

          {/* Description with Images */}
          <div className="detail-section">
            <h3 className="section-heading">Product Details & Images</h3>
            <div className="product-description-with-images">
              {/* Main Description */}
              <div className="description-text">
                <p className="detail-description">{product.description}</p>
              </div>

              {/* Product Images Gallery in Description */}
              {images.length > 1 && (
                <div className="description-images">
                  <h4>Product Images</h4>
                  <div className="description-image-grid">
                    {images.slice(1).map((img, idx) => (
                      <div key={idx} className="description-image-item">
                        <img
                          src={img}
                          alt={`${product.name} - View ${idx + 2}`}
                          onError={(e) => {
                            e.target.src = '/product-placeholder.svg';
                          }}
                        />
                        <p className="image-caption">View {idx + 2}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features with Icons */}
              <div className="key-features">
                <h4>Key Features</h4>
                <div className="features-grid">
                  {product.brand && (
                    <div className="feature-item">
                      <span className="feature-icon">🏷️</span>
                      <span>Brand: {product.brand}</span>
                    </div>
                  )}
                  {product.category_name && (
                    <div className="feature-item">
                      <span className="feature-icon">📂</span>
                      <span>Category: {product.category_name}</span>
                    </div>
                  )}
                  {specs.Display && (
                    <div className="feature-item">
                      <span className="feature-icon">📱</span>
                      <span>Display: {specs.Display}</span>
                    </div>
                  )}
                  {specs.Camera && (
                    <div className="feature-item">
                      <span className="feature-icon">📷</span>
                      <span>Camera: {specs.Camera}</span>
                    </div>
                  )}
                  {specs.Battery && (
                    <div className="feature-item">
                      <span className="feature-icon">🔋</span>
                      <span>Battery: {specs.Battery}</span>
                    </div>
                  )}
                  {specs.Processor && (
                    <div className="feature-item">
                      <span className="feature-icon">⚡</span>
                      <span>Processor: {specs.Processor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Product Images */}
              {images.length > 2 && (
                <div className="additional-images">
                  <h4>More Product Views</h4>
                  <div className="additional-images-grid">
                    {images.slice(2).map((img, idx) => (
                      <div key={idx} className="additional-image-wrapper">
                        <img
                          src={img}
                          alt={`${product.name} - Additional View ${idx + 3}`}
                          onError={(e) => {
                            e.target.src = '/product-placeholder.svg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          {Object.keys(specs).length > 0 && (
            <div className="detail-section">
              <h3 className="section-heading">Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Delivery info */}
          <div className="delivery-info">
            <div className="delivery-row">
              <span className="delivery-icon">🚚</span>
              <div>
                <strong>Free Delivery</strong>
                <p>Delivery by {getDeliveryDate()}</p>
              </div>
            </div>
            <div className="delivery-row">
              <span className="delivery-icon">↩️</span>
              <div><strong>7 Days Replacement Policy</strong></div>
            </div>
            <div className="delivery-row">
              <span className="delivery-icon">🏦</span>
              <div><strong>Cash on Delivery available</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
}

export default ProductDetailPage;