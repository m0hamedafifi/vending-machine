const express = require("express");
const router = express.Router();
const productsController = require("../controller/products.controller");
//middleware
const authMW  = require('../middleware/authMWToken');
const validProductMW = require('../middleware/validateProductDataMW');

// Create a new product
router.post(
    "/products/add",authMW.authenticateUser,
    validProductMW.isSeller,
    validProductMW.checkIsMissingFields,
    validProductMW.validateProductData,
    productsController.addNewProduct
  );
  
  // Get all products
  router.get("/products", productsController.getAllProducts);

  // Get all my products
  router.get("/products/me",authMW.authenticateUser, validProductMW.isSeller,productsController.getAllMyProducts);
  
  // Get specific product by id
  
  router.get("/products/:id", productsController.getOneProduct);
  
  // Update existing product
  router.put("/products/:id",authMW.authenticateUser,validProductMW.isSeller,validProductMW.validateProductData,productsController.updateProduct);
  
  // Delete product
  router.delete("/products/:id",authMW.authenticateUser, validProductMW.isSeller,productsController.deleteProduct);
  
  module.exports = router;
  