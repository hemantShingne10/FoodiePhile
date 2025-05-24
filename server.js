const express = require("express");
const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser"); 
const connectDB = require("./src/utils/db"); 

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importing Routes
const viewRoutes = require("./src/routes/viewRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

// Using the Routes
app.use("/", viewRoutes); 
app.use("/auth", authRoutes); 
app.use("/api/user", userRoutes); 
app.use("/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);


app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
