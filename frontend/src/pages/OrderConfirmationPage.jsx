import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/api';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(orderCode)
      .then(res => setOrder(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderCode]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;

  const addr = order?.shipping_address || {};

  // Estimated delivery date
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryDateStr = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="confirm-page">
      <div className="confirm-container">

        {/* Success Header */}
        <div className="confirm-header">
          <div className="success-icon">✓</div>
          <div className="confirm-header-text">
            <h1>Order Placed Successfully!</h1>
            <p>Your order has been confirmed and will be delivered soon.</p>
          </div>
        </div>

        {/* Order ID Banner */}
        <div className="order-id-banner">
          <div>
            <span className="order-id-label">Order ID</span>
            <span className="order-id-value">{orderCode}</span>
          </div>
          <div>
            <span className="order-id-label">Estimated Delivery</span>
            <span className="order-id-value delivery-date">{deliveryDateStr}</span>
          </div>
        </div>

        <div className="confirm-body">
          {/* Order Items */}
          {order?.items && (
            <div className="confirm-card">
              <h2 className="confirm-card-title">Order Items</h2>
              {order.items.map(item => (
                <div key={item.id} className="confirm-item">
                  <img
                    src={item.images?.[0] || ''}
                    alt={item.name}
                    className="confirm-item-img"
                  />
                  <div className="confirm-item-info">
                    <p className="confirm-item-name">{item.name}</p>
                    <p className="confirm-item-brand">{item.brand}</p>
                    <p className="confirm-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <div className="confirm-item-price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="confirm-total-row">
                <span>Total Amount Paid</span>
                <strong>₹{order?.total_amount?.toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div className="confirm-card">
            <h2 className="confirm-card-title">Delivery Address</h2>
            <div className="confirm-address">
              <p className="addr-name">{addr.name}</p>
              <p className="addr-line">{addr.address}</p>
              <p className="addr-line">{addr.city}, {addr.state} — {addr.pincode}</p>
              {addr.phone && <p className="addr-phone">📞 {addr.phone}</p>}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="confirm-card">
            <h2 className="confirm-card-title">Order Status</h2>
            <div className="status-timeline">
              <div className="timeline-item done">
                <div className="tl-dot" />
                <div className="tl-content">
                  <p className="tl-title">Order Confirmed</p>
                  <p className="tl-date">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="timeline-item pending">
                <div className="tl-dot" />
                <div className="tl-content">
                  <p className="tl-title">Shipped</p>
                  <p className="tl-date">In 1-2 days</p>
                </div>
              </div>
              <div className="timeline-item pending">
                <div className="tl-dot" />
                <div className="tl-content">
                  <p className="tl-title">Out for Delivery</p>
                  <p className="tl-date">Soon</p>
                </div>
              </div>
              <div className="timeline-item pending">
                <div className="tl-dot" />
                <div className="tl-content">
                  <p className="tl-title">Delivered</p>
                  <p className="tl-date">{deliveryDateStr}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="confirm-actions">
          <Link to="/" className="btn-continue-shopping">Continue Shopping</Link>
          <Link to="/orders" className="btn-view-orders">View All Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;