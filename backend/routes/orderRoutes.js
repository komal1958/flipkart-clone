const express = require("express");
const router = express.Router();
const pool = require("../config/db");

function generateOrderCode() {
  const digits = Math.floor(100000000000 + Math.random() * 900000000000);
  return `OD${digits}`;
}

// ⚠️  IMPORTANT: /history/:sessionId MUST come BEFORE /:orderCode
// Otherwise Express matches "history" as the :orderCode parameter
// GET /api/orders/history/:sessionId — order history
router.get("/history/:sessionId", async (req, res) => {
  try {
    const [orders] = await pool.execute(
      "SELECT * FROM orders WHERE session_id = ? ORDER BY created_at DESC",
      [req.params.sessionId]
    );
    const parsed = orders.map((o) => ({
      ...o,
      shipping_address:
        typeof o.shipping_address === "string" ? JSON.parse(o.shipping_address) : o.shipping_address,
    }));
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:orderCode — get order details (must be AFTER /history/:sessionId)
router.get("/:orderCode", async (req, res) => {
  try {
    const [orders] = await pool.execute(
      "SELECT * FROM orders WHERE order_code = ?",
      [req.params.orderCode]
    );
    if (orders.length === 0)
      return res.status(404).json({ success: false, message: "Order not found" });

    const order = orders[0];
    order.shipping_address =
      typeof order.shipping_address === "string"
        ? JSON.parse(order.shipping_address)
        : order.shipping_address;

    const [items] = await pool.execute(
      `SELECT oi.*, p.name, p.images, p.brand
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    const parsedItems = items.map((i) => ({
      ...i,
      images: typeof i.images === "string" ? JSON.parse(i.images) : i.images || [],
    }));

    res.json({ success: true, data: { ...order, items: parsedItems } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders — place a new order
router.post("/", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { sessionId, shippingAddress } = req.body;
    if (!sessionId || !shippingAddress)
      return res.status(400).json({ success: false, message: "sessionId and shippingAddress are required" });

    const [cartItems] = await conn.execute(
      `SELECT ci.product_id, ci.quantity, p.price, p.name, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.session_id = ?`,
      [sessionId]
    );
    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderCode = generateOrderCode();

    const [orderResult] = await conn.execute(
      `INSERT INTO orders (order_code, session_id, total_amount, shipping_address)
       VALUES (?, ?, ?, ?)`,
      [orderCode, sessionId, totalAmount, JSON.stringify(shippingAddress)]
    );
    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await conn.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
      await conn.execute(
        "UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    await conn.execute("DELETE FROM cart_items WHERE session_id = ?", [sessionId]);
    await conn.commit();

    res.json({
      success: true,
      message: "Order placed successfully",
      data: { orderId, orderCode, totalAmount },
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;