const express = require("express");
const router = express.Router();
const productsController = require("../controller/products.controller");
//middleware
const authMW  = require('../middleware/authMWToken');
const validator = require('../middleware/validateProductDataMW');

// Create a new product
router.post(
    "/products/add",authMW.authenticateUser,
    validator.isSeller,
    validator.checkIsMissingFields,
    validator.validateProductData,
    productsController.addNewProduct
  );
  
  // Get all products
  router.get("/products", productsController.getAllProducts);

  // Get all my products
  router.get("/products/me",authMW.authenticateUser, validator.isSeller,productsController.getAllMyProducts);
  
  // Get specific product by id
  
  router.get("/products/:id", productsController.getOneProduct);
  
  // Update existing product
  router.put("/products/:id",authMW.authenticateUser,validator.isSeller,validator.validateProductData,productsController.updateProduct);
  
  // Delete product
  router.delete("/products/:id",authMW.authenticateUser, validator.isSeller,productsController.deleteProduct);
  
  module.exports = router;
  