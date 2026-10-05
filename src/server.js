require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flashsale";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// 1. Health check
app.get("/", (req, res) => {
  res.json({ message: "Flash Sale Engine is running!" });
});

// 2. Retrieve real products from database
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 3. Seed an initial product (helper route so you have test data)
app.post("/products/seed", async (req, res) => {
  try {
    const sampleProduct = new Product({
      name: "Wireless Headphones",
      price: 4999,
      stock: 100
    });
    const saved = await sampleProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: "Failed to seed product" });
  }
});

// POST /orders - Naive Implementation
app.post("/orders", async (req, res) => {
  try {
    const { productId, userId } = req.body;

    // STEP 1: Read the product from the database
    const product = await Product.findById(productId);

    // STEP 2: Validation check
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // STEP 3: Business rule - check if stock is available
    if (product.stock <= 0) {
      return res.status(400).json({ error: "Item sold out!" });
    }

    // SIMULATED LATENCY (Crucial for learning):
    // In real systems, network delays or card validations take 50-100ms.
    // This tiny sleep pause exposes race conditions during high traffic.
    await new Promise((resolve) => setTimeout(resolve, 50));

    // STEP 4: Decrement the stock in memory, then save to database
    product.stock = product.stock - 1;
    await product.save();

    // STEP 5: Create and save the confirmed order
    const order = new Order({
      productId,
      userId
    });
    await order.save();

    return res.status(201).json({
      message: "Order placed successfully!",
      orderId: order._id,
      remainingStock: product.stock
    });
  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});