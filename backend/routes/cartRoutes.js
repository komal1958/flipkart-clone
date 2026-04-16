const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/cart/:sessionId — get all cart items for a session
router.get("/:sessionId", async (req, res) => {
  try {
    const [items] = await pool.execute(
      `SELECT ci.id, ci.quantity, ci.product_id,
              p.name, p.price, p.mrp, p.images, p.stock, p.brand
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.session_id = ?`,
      [req.params.sessionId]
    );
    const parsed = items.map((item) => ({
      ...item,
      images: typeof item.images === "string" ? JSON.parse(item.images) : item.images || [],
    }));
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cart — add item to cart
router.post("/", async (req, res) => {
  try {
    const { sessionId, productId, quantity = 1 } = req.body;
    if (!sessionId || !productId)
      return res.status(400).json({ success: false, message: "sessionId and productId are required" });

    const [existing] = await pool.execute(
      "SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?",
      [sessionId, productId]
    );
    if (existing.length > 0) {
      await pool.execute(
        "UPDATE cart_items SET quantity = quantity + ? WHERE session_id = ? AND product_id = ?",
        [quantity, sessionId, productId]
      );
    } else {
      await pool.execute(
        "INSERT INTO cart_items (session_id, product_id, quantity) VALUES (?, ?, ?)",
        [sessionId, productId, quantity]
      );
    }
    res.json({ success: true, message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cart/:id — update quantity
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1)
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    await pool.execute("UPDATE cart_items SET quantity = ? WHERE id = ?", [quantity, req.params.id]);
    res.json({ success: true, message: "Cart updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ⚠️  IMPORTANT: /clear/:sessionId MUST come BEFORE /:id
// Otherwise Express matches "clear" as the :id parameter
// DELETE /api/cart/clear/:sessionId — clear entire cart
router.delete("/clear/:sessionId", async (req, res) => {
  try {
    await pool.execute("DELETE FROM cart_items WHERE session_id = ?", [req.params.sessionId]);
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cart/:id — remove one item (must be AFTER /clear/:sessionId)
router.delete("/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM cart_items WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;