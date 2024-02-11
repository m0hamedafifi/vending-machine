const express = require("express");
const router = express.Router();
const productsController = require("../controller/products.controller");
//middleware
const authMW  = require('../middleware/authMWToken');

// Create a new product
router.post(
    "/products/add",authMW.authenticateUser,
    productsController.addNewProduct
  );
  
  // Get all products
  router.get("/products", productsController.getAllProducts);
  
  // Get specific product by id
  
  router.get("/products/:id", productsController.getOneProduct);
  
  // Update existing product
  router.put("/products/:id",authMW.authenticateUser, productsController.updateProduct);
  
  // Delete product
  router.delete("/products/:id",authMW.authenticateUser, productsController.deleteProduct);
  
  module.exports = router;
  