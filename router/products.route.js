const express = require("express");
const router = express.Router();
const productsController = require("../controller/products.controller");

// Create a new product
router.post(
    "/products/add",
    productsController.addNewProduct
  );
  
  // Get all products
  router.get("/products", productsController.getAllProducts);
  
  // Get specific product by id
  
  router.get("/products/:id", productsController.getOneProduct);
  
  // Update existing product
  router.put("/products/:id", productsController.updateProduct);
  
  // Delete product
  router.delete("/products/:id", productsController.deleteProduct);
  
  module.exports = router;
  