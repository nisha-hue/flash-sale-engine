const mongoose = require("mongoose");

// Schema defines the structure of each document in the 'orders' collection
const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId, // References the MongoDB _id of the product
      ref: "Product",
      required: true
    },
    userId: {
      type: String, // Identifies who placed the order (e.g., 'user-101')
      required: true
    },
    status: {
      type: String,
      default: "CONFIRMED" // Will track state: CONFIRMED, CANCELLED, PENDING
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Order", orderSchema);