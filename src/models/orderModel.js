// models/orderModel.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  deliveryAddress: { type: String, required: true },
  orderStatus: { type: String, default: "ACTIVE", enum: ["ACTIVE", "COMPLETED", "CANCELLED"] },
  paymentStatus: { type: String, default: "PENDING", enum: ["FAILED", "PENDING", "SUCCESS"] },
  transactionId: { type: String, default: null }, 
  orderItems: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
