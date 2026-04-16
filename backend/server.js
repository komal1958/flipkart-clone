const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes  = require("./routes/productRoutes");
const cartRoutes     = require("./routes/cartRoutes");
const orderRoutes    = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const authRoutes     = require("./routes/authRoutes");

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/products",  productRoutes);
app.use("/api/cart",      cartRoutes);
app.use("/api/orders",    orderRoutes);
app.use("/api/wishlist",  wishlistRoutes);
app.use("/api/auth",      authRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Flipkart Clone API is running 🚀" });
});

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Error handler ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});