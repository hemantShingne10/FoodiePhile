const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { 
        type: String, 
        required: true, 
        enum: ["Snacks", "Main Course", "Dessert", "Drinks"]
    },
    image: { type: String, required: true }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);

module.exports = Menu;
