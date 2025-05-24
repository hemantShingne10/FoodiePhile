const express = require("express");
const Order = require("../models/orderModel");

const router = express.Router();

//Route to create a unique user order
router.post("/create-order", async (req, res) => {
  try {
    const { userEmail, orderId, deliveryAddress, orderItems, totalPrice } = req.body;

    const newOrder = new Order({
      userEmail,
      orderId,
      deliveryAddress,
      orderItems,
      totalPrice,
      orderStatus: "ACTIVE",
      paymentStatus: "PENDING", 
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: "Order Created", orderId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order creation failed", error });
  }
});

//Route to Get all orders (for admin dashboard)
router.get("/getOrders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetching orders failed:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

//Route to Get orders for a specific user
router.get("/getUserOrders", async (req, res) => {
  const { email } = req.query; 

  if (!email) {
    return res.status(400).json({ error: "User email is required." });
  }

  try {
    const userOrders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });

    if (userOrders.length === 0) {
      return res.json([]); 
    }

    res.json(userOrders);
  } catch (error) {
    console.error("Fetching user orders failed:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

//Route to mark order as complete from active
router.patch("/markCompleted", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { orderStatus: "COMPLETED" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json({ message: "Order marked as completed successfully!", updatedOrder });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
});

module.exports = router;
