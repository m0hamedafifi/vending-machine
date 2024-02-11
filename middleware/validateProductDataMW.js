const validator = require("../util/validations");

// Validate the input product data
exports.validateProductData = (req, res, next) => {
  try {
    let { productName, amountAvailable, cost } = req.body;

    // check if the product missing required fields
    if (!productName || !amountAvailable || !cost) {
      return res.status(400).send({
        status: false,
        message:
          "Missing required fields product name or amount available or cost..!",
      });
    }

    // Check if name is provided and it's a string
    if (!validator.checkIsNumber(productName))
      return res
        .status(400)
        .send({ status: false, message: "Invalid product name.!" });

    // Check if amount available is provided and it's a string or a number

    if (validator.checkIsNumber(amountAvailable))
      return res
        .status(400)
        .send({
          status: false,
          message: "Amount Available should be a numeric value",
        });

    // check if cost is provided and it's a string or a number
    if (validator.checkIsNumber(cost))
      return res.status(400).send({
        status: false,
        message: "The Cost should be a Number.",
      });

    // data is correct
    next();
  } catch (err) {
    console.log("Error in validate Product Data middleware", err);
    res.status(500).send({
      status: false,
      message: "Internal Server Error..!",
    });
  }
};
