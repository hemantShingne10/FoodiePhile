const express = require("express");
const Menu = require("../models/menuModel");
const cloudinary = require("cloudinary").v2;
const { upload } = require("../config/cloudinary"); 

const router = express.Router();

// Route to add a menu item
router.post("/addMenuItem", upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || !description || !price || !category) {
         return res.status(400).json({ message: "All fields are required!" });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "Image is required!" });
        }

        const newItem = new Menu({
            name,
            description,
            price,
            category,
            image: req.file.path, 
            imageId: req.file.filename, 
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

    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found!" });
    }

    if (req.file && req.file.path) {
      if (menuItem.imageId) {
        await cloudinary.uploader.destroy(menuItem.imageId);
      }
      menuItem.image = req.file.path;         
      menuItem.imageId = req.file.filename;   
    }

    menuItem.name = name;
    menuItem.description = description;
    menuItem.price = price;
    menuItem.category = category;

    const updatedItem = await menuItem.save();

    res.status(200).json({
      message: "Menu item updated successfully!",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error.message);
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

    if (deletedItem.imageId) {
      await cloudinary.uploader.destroy(deletedItem.imageId);
    }

    res.status(200).json({ 
        message: "Menu item and image deleted successfully!",
        deletedItemId: deletedItem._id,
    });
  } catch (error) {
        res.status(500).json({ message: "Error deleting menu item", error });
    }
});


module.exports = router;
