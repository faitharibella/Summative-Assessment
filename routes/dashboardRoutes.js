const express = require("express");
const router = express.Router();
const Product = require("../model/Product");
const multer = require("multer"); // 1. Import multer

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//get dashboardRoute
router.get("/dashboard", async (req, res) => {
  try {
    // Fetch all real products from the database
    const products = await Product.find().sort({ createdAt: -1 });

    // Loop through products to calculate total value: Sum of (Price * Quantity)
    let totalStockValue = 0;
    products.forEach(product => {
      totalStockValue += (product.price * product.quantity);
    });

    const alertSuccess = req.query.alert === "success";

    // Render your layout with data directly plugged in
    res.render("dashboard", { 
      products: products,
      totalStockValue: totalStockValue,
      alertSuccess: alertSuccess
    });

  } catch (error) {
    console.error("Dashboard Loading Error:", error);
    res.status(500).send("Error loading dashboard data.");
  }
});

// POST: Save New Product Form Data AND Image Binary to Database
router.post("/dashboard", upload.single("productImage"), async (req, res) => {
  const { name, category, price, quantity, color } = req.body;
  
  try {
    const newProduct = new Product({
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
      color
    });
    
    // 4. Check if a file was uploaded by the user, then attach it to the new document
    if (req.file) {
      newProduct.imageBuffer = req.file.buffer;   // Saves the actual file as binary data
      newProduct.imageType = req.file.mimetype;    // Saves the file type (e.g., image/png, image/jpeg)
    }

    await newProduct.save();
    
    // Refresh dashboard so GET route fires again with the new item and updated total!
    res.redirect("/dashboard?alert=success");

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Could not save product details.");
  }
});

module.exports = router;