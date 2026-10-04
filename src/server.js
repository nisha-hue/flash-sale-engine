require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});