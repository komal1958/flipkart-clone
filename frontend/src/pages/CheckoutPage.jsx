import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContent';
import { placeOrder } from '../services/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Chandigarh','Jammu & Kashmir','Ladakh',
];

const CheckoutPage = () => {
  const { cart, sessionId, loadCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = address, 2 = payment, 3 = review

  const cartItems = cart || [];
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', city: '', state: '', pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPaymentComplete, setShowPaymentComplete] = useState(false);

  const delivery = (cartTotal > 499 && deliveryOption === 'standard') ? 0 : 
                   deliveryOption === 'express' ? 100 : 40;
  const savings = cartItems.reduce((s, i) => s + (i.mrp - i.price) * i.quantity, 0);
  const finalTotal = cartTotal + delivery;

  // Handle redirect after thank you window
  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        setShowThankYou(false);
        setStep(1);
        setForm({
          name: '', phone: '', email: '',
          address: '', city: '', state: '', pincode: '',
        });
        navigate('/', { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showThankYou, navigate]);

  // Handle payment completion animation transition
  useEffect(() => {
    if (showPaymentComplete) {
      const timer = setTimeout(() => {
        setShowPaymentComplete(false);
        setStep(3);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPaymentComplete]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter valid 10-digit mobile number';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter valid email';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state) errs.state = 'Please select a state';
    if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter valid 6-digit pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (validate()) setStep(2);
  };

  const handleContinueToReview = () => {
    // Show payment completion animation
    setShowPaymentComplete(true);
    // The transition to review step is handled by useEffect
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const res = await placeOrder({
        sessionId,
        shippingAddress: { ...form, paymentMethod, deliveryOption }
      });
      const { orderCode } = res.data.data;
      await loadCart(sessionId);

      // Show thank you message - redirect will be handled by useEffect
      setShowThankYou(true);

    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">DELIVERY ADDRESS</span>
          </div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">PAYMENT</span>
          </div>
          <div className="step-line" />
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">REVIEW</span>
          </div>
        </div>

        <div className="checkout-body">
          {/* Left */}
          <div className="checkout-left">

            {/* ── STEP 1: Address Form ── */}
            {step === 1 && (
              <div className="checkout-card">
                <h2 className="checkout-card-title">Delivery Address</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Email (optional)</label>
                  <input name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" type="email" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Address (House No, Building, Street, Area) *</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows={3}
                  />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City / Town *</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" maxLength={6} />
                    {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <select name="state" value={form.state} onChange={handleChange}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="field-error">{errors.state}</span>}
                </div>

                <button className="continue-btn" onClick={handleContinue}>
                  CONTINUE
                </button>
              </div>
            )}

            {/* ── STEP 2: Payment Method ── */}
            {step === 2 && (
              <div className="checkout-card">
                <h2 className="checkout-card-title">Payment Method</h2>

                {/* Delivery Options */}
                <div className="delivery-options-section">
                  <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Choose Delivery Option</h3>
                  <label className="delivery-option">
                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={deliveryOption === 'standard'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                    />
                    <div className="delivery-info">
                      <span className="delivery-name">🚚 Standard Delivery</span>
                      <span className="delivery-desc">Delivered in 3-5 business days</span>
                      <span className="delivery-price">FREE</span>
                    </div>
                  </label>
                  <label className="delivery-option">
                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={deliveryOption === 'express'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                    />
                    <div className="delivery-info">
                      <span className="delivery-name">⚡ Express Delivery</span>
                      <span className="delivery-desc">Delivered in 1-2 business days</span>
                      <span className="delivery-price">₹100</span>
                    </div>
                  </label>
                </div>

                <hr style={{ margin: '20px 0', borderColor: 'var(--fk-border)' }} />

                {/* Payment Options */}
                <div className="payment-section">
                  <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Choose Payment Method</h3>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span>💵 Cash on Delivery</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span>💳 Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span>📱 UPI</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span>🏦 Net Banking</span>
                  </label>
                </div>

                <div className="step-navigation">
                  <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
                  <button className="continue-btn" onClick={handleContinueToReview}>
                    CONTINUE TO REVIEW
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Review ── */}
            {step === 3 && (
              <div className="checkout-card">
                <div className="review-address-header">
                  <div>
                    <h2 className="checkout-card-title">Delivering to: <strong>{form.name}</strong></h2>
                    <p className="review-address-text">
                      {form.address}, {form.city}, {form.state} — {form.pincode}
                    </p>
                    <p className="review-phone">📞 {form.phone}</p>
                  </div>
                  <div className="review-action-buttons">
                    <button className="change-btn" onClick={() => setStep(1)}>Change Address</button>
                  </div>
                </div>

                <hr style={{ margin: '16px 0', borderColor: 'var(--fk-border)' }} />

                {/* Delivery & Payment Summary */}
                <div className="order-summary-section">
                  <div className="summary-item">
                    <span className="summary-label">Delivery Option:</span>
                    <span className="summary-value">
                      {deliveryOption === 'standard' ? '🚚 Standard Delivery (3-5 days)' : '⚡ Express Delivery (1-2 days)'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Payment Method:</span>
                    <span className="summary-value">
                      {paymentMethod === 'cod' ? '💵 Cash on Delivery' :
                       paymentMethod === 'card' ? '💳 Credit/Debit Card' :
                       paymentMethod === 'upi' ? '📱 UPI' : '🏦 Net Banking'}
                    </span>
                  </div>
                </div>

                <hr style={{ margin: '16px 0', borderColor: 'var(--fk-border)' }} />

                <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Order Items</h3>
                {cartItems.map(item => (
                  <div key={item.id} className="review-item">
                    <img src={item.images?.[0] || ''} alt={item.name} className="review-item-img" />
                    <div className="review-item-info">
                      <p className="review-item-name">{item.name}</p>
                      <p className="review-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="review-item-price">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}

                <div className="step-navigation">
                  <button className="back-btn" onClick={() => setStep(2)}>← Back to Payment</button>
                  <button
                    className="place-order-final-btn"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                  >
                    {placing ? 'Placing Order...' : '✓ PLACE ORDER'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — Summary */}
          <div className="checkout-summary">
            <div className="summary-card">
              <h3 className="summary-title">PRICE DETAILS</h3>
              <hr />
              <div className="summary-row">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{cartItems.reduce((s, i) => s + i.mrp * i.quantity, 0).toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <span className="green">− ₹{savings.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className={delivery === 0 ? 'green' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total Amount</span>
                <strong>₹{finalTotal.toLocaleString()}</strong>
              </div>
              {savings > 0 && (
                <p className="green-msg">You will save ₹{savings.toLocaleString()} on this order</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Complete Animation */}
      {showPaymentComplete && (
        <div className="payment-complete-overlay">
          <div className="payment-complete-modal">
            <div className="checkmark-wrapper">
              <div className="checkmark-circle">
                <svg className="checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <h2>Payment Confirmed!</h2>
            <p>Proceeding to review your order...</p>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="thank-you-overlay">
          <div className="thank-you-modal">
            <div className="thank-you-content">
              <div className="thank-you-icon">🎉</div>
              <h2>Thank You for Shopping with Us!</h2>
              <p>Your order has been placed successfully.</p>
              <p className="thank-you-subtitle">Redirecting to home page...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;