const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/products — list with optional search & category filter
router.get("/", async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = `
      SELECT p.*, c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += " AND (p.name LIKE ? OR p.brand LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      query += " AND c.name = ?";
      params.push(category);
    }

    // Sorting
    if (sort === "price_asc") query += " ORDER BY p.price ASC";
    else if (sort === "price_desc") query += " ORDER BY p.price DESC";
    else if (sort === "rating") query += " ORDER BY p.rating DESC";
    else query += " ORDER BY p.id DESC";

    const [products] = await pool.execute(query, params);

    // Parse JSON fields
    const parsed = products.map((p) => ({
      ...p,
      images: typeof p.images === "string" ? JSON.parse(p.images) : p.images || [],
      specifications: typeof p.specifications === "string" ? JSON.parse(p.specifications) : p.specifications || {},
    }));

    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/categories — all categories
router.get("/categories", async (req, res) => {
  try {
    const [categories] = await pool.execute("SELECT * FROM categories ORDER BY name");
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id — single product detail
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name AS category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Product not found" });

    const product = rows[0];
    product.images = typeof product.images === "string" ? JSON.parse(product.images) : product.images || [];
    product.specifications = typeof product.specifications === "string" ? JSON.parse(product.specifications) : product.specifications || {};

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id/images — update product images
router.put("/:id/images", async (req, res) => {
  try {
    const { images } = req.body;
    
    // Validate images array
    if (!Array.isArray(images)) {
      return res.status(400).json({ success: false, message: "Images must be an array of URLs" });
    }
    
    // Check if product exists
    const [rows] = await pool.execute("SELECT id FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    // Update images in database
    await pool.execute("UPDATE products SET images = ? WHERE id = ?", [JSON.stringify(images), req.params.id]);
    
    res.json({ success: true, message: "Product images updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;