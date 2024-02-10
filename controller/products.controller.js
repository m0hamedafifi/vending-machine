const Product = require('../model/products.model');

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
        sellerId: req.body.sellerId,
        productId: req.body.productId,
      };
      
      // Check if the user has provided all required fields
    if (!obj.productName || !obj.amountAvailable || !obj.cost || !obj.sellerId ) {
        return res
          .status(400)
          .send({ status: false, message: "Please fill out all fields!" });
      }

    // create a new product using our model
    let newProduct = new Product(obj); 
    
    // save the new product in the database
    let data = await newProduct.save();

    // send back the response with success message and the created product
    return res.status(201).send({
        status: true,
        message: "product added Successfully",
        results: data,
      });
      } catch (err) {
        console.log("Error at add new product : ", err.message);
        return res.status(500).send({ status: false, message: "Internal Server Error..!" });
      }
};

// ----------------------------------------------------------------
// Get all products
// ----------------------------------------------------------------
exports.getAllProducts = async (req, res) => {
   try{
    let data = await Product.find({}, { _id: 0, __v: 0 }).sort({ productId: "asc" }); // get all records in the database
    if (!data) {
      return res
        .status(404)
        .send({ status: false, message: "No Data Found...!" });
    }

    return res.status(200).send({ status: true, results: data }); // return data to client-side
} catch (err) {
    console.error(`Server Error at get all products : ${err.message}`);
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
    if (!data)
      return res
        .status(404)
        .send({ status: false, message: `Data not found for the given Id` });

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
    let data = await Product.findOneAndUpdate({ productId: id }, { $set: updateOps });
    if (!data) {
      return res.status(400).json({
        status: false,
        message: "Operation failed!",
      }); 
    }
    return res.status(200).json({
      status: true,
      message: "Product has been updated successfully",
    });
  } catch (err) {
    console.log("Error at update product : ",err.message);
    return res.status(400).json({
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
    let data = await Product.findOneAndDelete({productId: id});

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "No record found with provided ID",
      });
    } 

      return res.status(200).json({
        status: true,
        data: data,
        message: "product deleted Successfully",
      });
    
  } catch (err) {
    console.error("Error at delete product",err.message);
    return res.status(500).send({status:false , message:"Internal Server Error...!"});
  }
};
