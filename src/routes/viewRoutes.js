const express = require("express");
const path = require("path");
const router = express.Router();

// Serve all the files from views folder
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "index.html"));
});

router.get("/menu.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "menu.html"));
});

router.get("/aboutUs.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "aboutUs.html"));
});

router.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "signup.html"));
});

router.get("/cart.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "cart.html"));
});

router.get("/profile.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "profile.html"));
});

router.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "admin.html"));
});

router.get("/orders.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "orders.html"));
});

router.get("/adminMenu.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "adminMenu.html"));
});

router.get("/resetPwd.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "resetPwd.html"));
});

module.exports = router;
