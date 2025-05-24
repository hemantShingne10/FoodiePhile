// CreateAdmin.js
const mongoose = require("mongoose");
const Admin = require("../models/adminModel");

mongoose
  .connect("mongodb://localhost:27017/food-ordering-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

async function createAdmin() {
  const admin = new Admin({
    email: "admin@gmail.com",
    password: "Ad@12345", 
  });

  try {
    await admin.save();
    console.log("Admin created successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error creating admin:", err);
    mongoose.disconnect();
  }
}

createAdmin();
