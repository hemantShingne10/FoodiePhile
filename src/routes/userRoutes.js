const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

//Route to Add new Address
router.post("/addAddress", async (req, res) => {
  const { email, address } = req.body;
  try {
    const user = await User.findOne({ email }); 
    if (user) {
      user.addresses.push(address); 
      await user.save(); 
      res.json({ success: true, user }); 
    } else {
      res.json({ success: false, message: "User not found." }); 
    }
  } catch (error) {
    res.status(500).json({ success: false, error }); 
  }
});

//Route to Remove Address
router.delete("/removeAddress", async (req, res) => {
  const { email, address } = req.body;

  try {
    const user = await User.findOne({ email }); 
    if (user) {
      const addressIndex = user.addresses.indexOf(address);
      if (addressIndex > -1) {
        user.addresses.splice(addressIndex, 1); 
        await user.save();
        res.json({ success: true, user }); 
      } else {
        res.json({ success: false, message: "Address not found." });
      }
    } else {
      res.json({ success: false, message: "User not found." });
    }
  } catch (error) {
    console.error("Error removing address:", error);
    res.status(500).json({ success: false, error });
  }
});

//Route to Update User Profile
router.post("/updateProfile", async (req, res) => {
  const { email, username, mobile } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.username = username;
      user.mobile = mobile;
      await user.save();
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;
