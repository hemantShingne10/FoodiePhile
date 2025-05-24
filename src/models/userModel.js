const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  addresses: { type: [String], default: [] },  
  profilePic: { type: String, default: "../images/default_profile" }, 

  resetToken: { type: String, default: null },         
  resetTokenExpires: { type: Date, default: null },
} , { timestamps: true }); 

// Hashing the password before saving the user
userSchema.pre("save", async function (next) {
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

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
