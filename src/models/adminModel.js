const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Defination of our Admin schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hashing the password before saving in admin
adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next(); 
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

adminSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

// Create the Admin model
const Admin = mongoose.model.Admin || mongoose.model("Admin", adminSchema);

module.exports = Admin;
