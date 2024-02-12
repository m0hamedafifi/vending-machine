const Product = require("../model/products.model");
const Logger = require("../services/logger");

//----------------------------------------------------------------
// add new logger object to the controller
//----------------------------------------------------------------
const logger = new Logger("ProductController");
// ----------------------------------------------------------------
//                        CRUD Operations
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// Create a new Product instance
// ----------------------------------------------------------------
exports.addNewProduct = async (req, res) => {
  try {
    // get the latest id from the server's database and increment it by one for our new object
    let lastId = await Product.findOne().sort({ productId: "desc" }).exec();
    if (!lastId) lastId = 1;
    else lastId = lastId.productId + 1;
    req.body.productId = lastId;

    // adding the body to the obj to check the input
    let obj = {
      productName: req.body.productName,
      amountAvailable: req.body.amountAvailable,
      cost: req.body.cost,
      sellerId: req.body.userId,
      productId: req.body.productId,
    };

    // create a new product using our model
    let newProduct = new Product(obj);

    // save the new product in the database
    let data = await newProduct.save();

    logger.info("Product saved successfully!", data);
    // send back the response with success message and the created product
    return res.status(201).send({
      status: true,
      message: "product added Successfully with id '" + data.productId + "'",
      results: data,
    });
  } catch (err) {
    // console.log("Error at add new product : ", err.message);
    logger.error(`Failed to add new product ${err.message}`);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error..!" });
  }
};

// ----------------------------------------------------------------
// Get all products
// ----------------------------------------------------------------
exports.getAllProducts = async (req, res) => {
  try {
    let data = await Product.find({}, { _id: 0, __v: 0 }).sort({
      productId: "asc",
    }); // get all records in the database
    if (!data) {
      logger.error("No record found!");
      return res
        .status(404)
        .send({ status: false, message: "No Data Found...!" });
    }
    logger.info("Data fetched successfully!", data);
    return res.status(200).send({ status: true, results: data }); // return data to client-side
  } catch (err) {
    // console.error(`Server Error at get all products : ${err.message}`);
    logger.error(`Server Error at get all products : ${err.message}`);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error...!" });
  }
};

// ----------------------------------------------------------------
// Get all my products
// ----------------------------------------------------------------
exports.getAllMyProducts = async (req, res) => {
  try {
    let userId = req.body.userId;
    let data = await Product.find(
      { sellerId: userId },
      { _id: 0, __v: 0 }
    ).sort({
      productId: "asc",
    }); // get all records in the database
    if (!data) {
      logger.error(`Product not found for userId : ${userId}`);
      return res
        .status(404)
        .send({ status: false, message: "No Data Found...!" });
    }
    logger.info(`User's product fetched successfully!`, data);
    return res.status(200).send({ status: true, results: data }); // return data to client-side
  } catch (err) {
    // console.error(`Server Error at get all products : ${err.message}`);
    logger.error(`Server Error at get all products of a user : ${err.message}`);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error...!" });
  }
};

// ----------------------------------------------------------------
// Get one product by ID
// ----------------------------------------------------------------
exports.getOneProduct = async (req, res) => {
  const id = req.params.id;
  try {
    let data = await Product.findOne({ productId: id }, { _id: 0, __v: 0 });
    if (!data) {
      logger.error(`Product ${id} not found`);
      return res
        .status(404)
        .send({ status: false, message: `Data not found for the given Id` });
    }
    logger.info(`Product fetched successfully!`, data);
    return res.status(200).send({ status: true, results: data }); // return data to client-side
  } catch (err) {
    console.error(`Server Error : ${err.message}`);
    return res
      .status(404)
      .json({ status: false, message: `Internal Server Error...!` });
  }
};

// ----------------------------------------------------------------
// Update a product by its ID
// ----------------------------------------------------------------
exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const updateOps = req.body;

  try {
    let owner = await isOwner(id, req.body.userId);
    if (!owner) {
      logger.error(
        `Product not found for the given user or permission denied.`
      );
      return res
        .status(401)
        .send({ status: false, message: "You are not authorized!" });
    }
    let data = await Product.findOneAndUpdate(
      { productId: id },
      { $set: updateOps },
      { new: true }
    );
    if (!data) {
      logger.error(`Failed to update product with id : ${id}`);
      return res.status(400).send({
        status: false,
        message: "Operation failed!",
      });
    }
    logger.info("Product updated Successfully!", data);
    return res.status(200).send({
      status: true,
      message: "Product has been updated successfully",
    });
  } catch (err) {
    // console.log("Error at update product : ", err.message);
    logger.error(`Error at update product : ${err.message}`);
    return res.status(400).send({
      status: false,
      message: `Error updating product: ${err}`,
    });
  }
};

// ----------------------------------------------------------------
// Delete a product by its ID
// ----------------------------------------------------------------
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    let owner = await isOwner(id, req.body.userId);
    if (!owner) {
      logger.error("Product not found or you don't have permission!");
      return res
        .status(401)
        .send({ status: false, message: "You are not authorized!" });
    }

    let data = await Product.findOneAndDelete({ productId: id });

    if (!data) {
      logger.error("Product not found!");
      return res.status(404).json({
        status: false,
        message: "No record found with provided ID",
      });
    }
    logger.info("Product deleted Successfully!", data);
    return res.status(200).json({
      status: true,
      data: data,
      message: "product deleted Successfully",
    });
  } catch (err) {
    // console.error("Error at delete product", err.message);
    logger.error(`Error at delete product: ${err.message}`);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error...!" });
  }
};

// -----------------------------------------------------------------
// check the product owner
//------------------------------------------------------------------
async function isOwner(productId, owner) {
  try {
    let product = await Product.findOne({ productId: productId });
    if (!product) {
      return false;
    }
    if (!(owner == product.sellerId)) return false;

    return true;
  } catch (err) {
    // console.log("Error at function is owner :", err);
    logger.error(`Error at function is owner: ${err.message}` );
    return false;
  }
}
