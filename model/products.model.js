const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    amountAvailable: { type: Number, required: true },
    cost: { type: String, required: true },
    sellerId : { type: String, required: true },  //Should be a reference to the user who is selling this item
    productId: { type: Number, required: true, unique: true },
  });
  const product = mongoose.model("products", productSchema);
  // create model
  module.exports = product;
  