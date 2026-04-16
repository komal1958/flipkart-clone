import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrderHistory } from '../services/api';
import { useCart } from '../context/CartContent';
import './OrdersPage.css';

const STATUS_COLOR = {
  confirmed: '#388e3c',
  shipped: '#1565c0',
  delivered: '#388e3c',
  pending: '#ff9f00',
  cancelled: '#f44336',
};

const OrdersPage = () => {
  const { sessionId } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderHistory(sessionId)
      .then(res => setOrders(res.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div style={{ fontSize: 64 }}>📦</div>
            <h2>No orders yet</h2>
            <p>When you place orders, they'll appear here.</p>
            <Link to="/" className="shop-now-link">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const addr = order.shipping_address || {};
              const statusColor = STATUS_COLOR[order.status] || '#888';
              const date = new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              });

              return (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-label">ORDER ID</span>
                      <span className="order-code">{order.order_code}</span>
                    </div>
                    <div>
                      <span className="order-label">DATE</span>
                      <span className="order-date">{date}</span>
                    </div>
                    <div>
                      <span className="order-label">TOTAL</span>
                      <span className="order-total">₹{Number(order.total_amount).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="order-label">STATUS</span>
                      <span className="order-status" style={{ color: statusColor }}>
                        ● {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="order-card-body">
                    <div className="order-address">
                      <span>📍 {addr.address}, {addr.city}, {addr.state} — {addr.pincode}</span>
                    </div>
                    <Link to={`/order-confirmation/${order.order_code}`} className="view-order-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;