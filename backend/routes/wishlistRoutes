const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/wishlist/:sessionId - Get wishlist items
router.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const [items] = await pool.execute(
      `SELECT wi.product_id, p.name, p.price, p.mrp, p.images, p.brand
       FROM wishlist_items wi
       JOIN products p ON wi.product_id = p.id
       WHERE wi.session_id = ?`,
      [sessionId]
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

// POST /api/wishlist - Add to wishlist
router.post("/", async (req, res) => {
  try {
    const { sessionId, productId } = req.body;

    // Check if already exists
    const [existing] = await pool.execute(
      "SELECT id FROM wishlist_items WHERE session_id = ? AND product_id = ?",
      [sessionId, productId]
    );

    if (existing.length > 0) {
      return res.json({ success: true, message: "Already in wishlist" });
    }

    await pool.execute(
      "INSERT INTO wishlist_items (session_id, product_id) VALUES (?, ?)",
      [sessionId, productId]
    );

    res.json({ success: true, message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/wishlist/:sessionId/:productId - Remove from wishlist
router.delete("/:sessionId/:productId", async (req, res) => {
  try {
    const { sessionId, productId } = req.params;

    await pool.execute(
      "DELETE FROM wishlist_items WHERE session_id = ? AND product_id = ?",
      [sessionId, productId]
    );

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;