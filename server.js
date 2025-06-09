const express = require("express");
const path = require("path");
require("dotenv").config();
const helmet = require("helmet");
const connectDB = require("./src/utils/db"); 

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public"), {maxAge: "30d",}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://sdk.cashfree.com",
        "https://use.fontawesome.com",
        "'unsafe-inline'"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://use.fontawesome.com"
      ],
      fontSrc: [
        "'self'",
        "https://use.fontawesome.com",
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://res.cloudinary.com"
      ],
      connectSrc: [
        "'self'",
        "https://sdk.cashfree.com",
        "https://api.cashfree.com",
        "https://sandbox.cashfree.com"
      ],
      frameSrc: [
        "'self'",
        "https://sdk.cashfree.com",
        "https://sandbox.cashfree.com"
      ],
      formAction: [
        "'self'",
        "https://sandbox.cashfree.com"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));


app.get("/health", (req, res) => res.send("OK"));

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
