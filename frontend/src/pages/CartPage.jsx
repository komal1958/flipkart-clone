import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContent';
import { toast } from 'react-toastify';
import './CartPage.css';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    try {
      if (!cart || cart.length === 0) {
        toast.warning('Your cart is empty. Please add items first.');
        return;
      }
      navigate('/checkout');
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to proceed. Please try again.');
    }
  };

  const cartItems = cart || [];
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + (item.mrp - item.price) * item.quantity, 0);
  const deliveryCharge = cartTotal > 499 ? 0 : 40;
  const finalTotal = cartTotal + deliveryCharge;

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-box">
          <img
            src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32d-765a-4d8b-b4a6-520b560971e8.png"
            alt="empty cart"
          />
          <h2>Your cart is empty!</h2>
          <p>Add items to it now.</p>
          <Link to="/" className="shop-now-btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Left — Cart Items */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h2>My Cart ({cartItems.length} items)</h2>
            {savings > 0 && (
              <span className="cart-savings">You'll save ₹{savings.toLocaleString()} on this order</span>
            )}
          </div>

          {cartItems.map((item) => {
            const image = item.images?.[0] || 'https://via.placeholder.com/100x100';
            const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);

            return (
              <div key={item.id} className="cart-item">
                {/* Product image */}
                <Link to={`/product/${item.product_id}`} className="cart-item-img-wrap">
                  <img src={image} alt={item.name} />
                </Link>

                {/* Info */}
                <div className="cart-item-info">
                  <Link to={`/product/${item.product_id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <p className="cart-item-brand">{item.brand}</p>

                  <div className="cart-item-price-row">
                    <span className="cart-item-price">₹{item.price.toLocaleString()}</span>
                    <span className="cart-item-mrp">₹{item.mrp.toLocaleString()}</span>
                    <span className="cart-item-discount">{discount}% off</span>
                  </div>

                  {/* Quantity controls */}
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      REMOVE
                    </button>
                  </div>
                </div>

                {/* Item total */}
                <div className="cart-item-total">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            );
          })}

          {/* Proceed to checkout */}
          <div className="cart-bottom-bar">
            <button className="proceed-checkout-btn" onClick={handleProceedToCheckout}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>

        {/* Right — Price Summary */}
        <div className="price-summary">
          <h3 className="summary-title">PRICE DETAILS</h3>
          <hr />
          <div className="summary-row">
            <span>Price ({cartItems.length} items)</span>
            <span>₹{cartItems.reduce((s, i) => s + i.mrp * i.quantity, 0).toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span className="discount-val">− ₹{savings.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span className={deliveryCharge === 0 ? 'free-delivery' : ''}>
              {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
            </span>
          </div>
          <hr />
          <div className="summary-row total-row">
            <span>Total Amount</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>
          <hr />
          {savings > 0 && (
            <p className="summary-savings">You will save ₹{savings.toLocaleString()} on this order</p>
          )}
          <button className="proceed-checkout-btn full-width" onClick={handleProceedToCheckout}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;