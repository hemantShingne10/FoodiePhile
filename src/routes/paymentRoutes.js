const express = require("express");
const axios = require("axios");
const router = express.Router();
const nodemailer = require("nodemailer");
const Order = require("../models/orderModel");
const User = require("../models/userModel")
require("dotenv").config();

const APP_ID = process.env.CASHFREE_APP_ID; 
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const ENVIRONMENT = "TEST";

const BASE_URL =
  ENVIRONMENT === "TEST"
    ? "https://sandbox.cashfree.com/pg/orders"
    : "https://api.cashfree.com/pg/orders";

//Route for Creating Payment Order 
router.post("/create-payment-order", async (req, res) => {
  const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;

  try {
    const response = await axios.post(
      BASE_URL,
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: orderId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": APP_ID,
          "x-client-secret": SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Cashfree Order Error:", error.response?.data || error);
    res.status(500).json({ success: false, message: "Payment Order Creation Failed", error });
  }
});


//Route to Verify Payment & Send Confirmation Email
router.post("/verify-payment", async (req, res) => {
  const { orderId } = req.body;

  try {
    console.log("Fetching payment status for order:", orderId);

    //Fetching order details from Cashfree API
    const cashfreeResponse = await fetch(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": APP_ID,
        "x-client-secret": SECRET_KEY,
      },
    });

    const orderData = await cashfreeResponse.json();
    console.log("Cashfree Order Data:", orderData);

    if (!cashfreeResponse.ok) {
      return res.status(500).json({
        success: false,
        message: `Cashfree API error: ${orderData.message || "Unknown error"}`,
      });
    }

    //Fetching payment details to get the transaction ID
    const paymentDetailsResponse = await fetch(orderData.payments.url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": APP_ID,
        "x-client-secret": SECRET_KEY,
      },
    });

    const paymentDetails = await paymentDetailsResponse.json();
    console.log("CashFree Payment Details:", JSON.stringify(paymentDetails, null, 2));

    const transactionId = Array.isArray(paymentDetails) && paymentDetails.length > 0
      ? paymentDetails[0]?.cf_payment_id || "Unknown"
      : "Unknown";

    console.log("Extracted Transaction ID:", transactionId);

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const user = await User.findOne({ email: order.userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (["PAID", "SUCCESS", "COMPLETED", "PAYMENT_SUCCESSFUL"].includes(orderData.order_status)) {
      order.paymentStatus = "SUCCESS";
      order.transactionId = transactionId; 
      order.updatedAt = new Date();
      await order.save();

      await sendOrderConfirmationEmail(user, order);

      return res.status(200).json({
        success: true,
        message: "Payment verified, order updated, and email sent.",
        paymentStatus: "SUCCESS",
        transactionId: order.transactionId,
        totalPrice: order.totalPrice,
      });
    } else {
      order.paymentStatus = "FAILED";
      order.orderStatus = "CANCELLED";
      order.updatedAt = new Date();
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment failed or pending",
        paymentStatus: "FAILED",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

//function to send order details Email
async function sendOrderConfirmationEmail(user, order) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
    }
  });

  const orderItemsHTML = order.orderItems.map(item => `
      <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price * item.quantity}</td>
      </tr>`).join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Thank You for Your Order! ",
    html: `
        <h2>Thank You, ${user.username}!</h2>
        <p>Your order has been successfully placed.</p>

        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Amount Paid:</strong> ₹${order.totalPrice}</p>
        <p><strong>Transaction ID:</strong> ${order.transactionId}</p>
        <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>

        <h3>Ordered Items:</h3>
        <table border="1" cellspacing="0" cellpadding="5">
            <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
            ${orderItemsHTML}
        </table>

        <p>We are processing your order, sit back and hold tight as we will deliver it to you as soon as possible!</p>
        <p>Thank you for choosing <strong>FoodiePhile Co.</strong>. We hope to serve you again soon!</p>
        <p>Have fun and Enjoy Your Food </p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = router;
