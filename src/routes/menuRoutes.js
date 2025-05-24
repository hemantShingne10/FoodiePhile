const express = require("express");
const multer = require("multer");
const path = require("path");
const Menu = require("../models/menuModel");

const router = express.Router();

// Setting up storage for images
const storage = multer.diskStorage({
    destination: "./uploads/", 
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

// Route to add a menu item
router.post("/addMenuItem", upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required!" });
        }

        const newItem = new Menu({
            name,
            description,
            price,
            category,
            image: `/uploads/${req.file.filename}`
        });

        await newItem.save();
        res.status(201).json({ message: "Menu item added successfully!", item: newItem });
    } catch (error) {
        console.error("Error adding menu item:", error.message); 
        res.status(500).json({ message: "Error adding menu item", error });
    }
});

// Route to get all menu items
router.get("/menuItems", async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu items", error });
    }
});

// Route to update a menu item
router.put("/updateMenuItem/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        let updateData = { name, description, price, category };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedItem = await Menu.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: "Menu item not found!" });
        }

        res.status(200).json({ message: "Menu item updated successfully!", item: updatedItem });
    } catch (error) {
        res.status(500).json({ message: "Error updating menu item", error });
    }
});

// Route to delete a menu item
router.delete("/deleteMenuItem/:id", async (req, res) => {
    try {
        const deletedItem = await Menu.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Menu item not found!" });
        }

        res.status(200).json({ message: "Menu item deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting menu item", error });
    }
});

module.exports = router;
