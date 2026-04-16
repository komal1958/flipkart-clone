import { useState } from 'react';
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
  const { cartItems, cartTotal, sessionId, fetchCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(1); // 1 = address, 2 = review

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', city: '', state: '', pincode: '',
  });
  const [errors, setErrors] = useState({});

  const delivery = cartTotal > 499 ? 0 : 40;
  const savings = cartItems.reduce((s, i) => s + (i.mrp - i.price) * i.quantity, 0);
  const finalTotal = cartTotal + delivery;

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

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const res = await placeOrder({ sessionId, shippingAddress: form });
      const { orderCode } = res.data.data;
      await fetchCart();
      navigate(`/order-confirmation/${orderCode}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
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

        {/* Steps indicator */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">DELIVERY ADDRESS</span>
          </div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">ORDER SUMMARY</span>
          </div>
          <div className="step-line" />
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">PAYMENT</span>
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

            {/* ── STEP 2: Review ── */}
            {step === 2 && (
              <div className="checkout-card">
                <div className="review-address-header">
                  <div>
                    <h2 className="checkout-card-title">Delivering to: <strong>{form.name}</strong></h2>
                    <p className="review-address-text">
                      {form.address}, {form.city}, {form.state} — {form.pincode}
                    </p>
                    <p className="review-phone">📞 {form.phone}</p>
                  </div>
                  <button className="change-btn" onClick={() => setStep(1)}>Change</button>
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

                <hr style={{ margin: '16px 0', borderColor: 'var(--fk-border)' }} />

                {/* Payment method (UI only — COD) */}
                <div className="payment-section">
                  <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Payment Method</h3>
                  <label className="payment-option selected">
                    <input type="radio" checked readOnly />
                    <span>💵 Cash on Delivery</span>
                  </label>
                </div>

                <button
                  className="place-order-final-btn"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? 'Placing Order...' : '✓ PLACE ORDER'}
                </button>
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
    </div>
  );
};

export default CheckoutPage;