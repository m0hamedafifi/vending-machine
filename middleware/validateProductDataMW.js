const validator = require("../util/validations");
const Logger = require("../services/logger");

//----------------------------------------------------------------
// add new logger object to the Middleware
//----------------------------------------------------------------
const logger = new Logger("ProductDataValidationMW");

// check if the product missing required fields
exports.checkIsMissingFields = (req, res, next) => {
  try {
    let { productName, amountAvailable, cost } = req.body;

    // check if the product missing required fields
    if (!productName || !amountAvailable || !cost) {
      logger.error("Product missing required fields for creation.");
      return res.status(400).send({
        status: false,
        message:
          "Missing required fields product name or amount available or cost..!",
      });
    }

    next();
  } catch (err) {
    // console.log("Error in checking missing field : ", err);
    logger.error(
      `Product missing required fields for creation - ${err.message}`
    );
    return res.status(500).send({
      status: false,
      error: "Internal Server Error..!",
    });
  }
};

// Validate the input product data
exports.validateProductData = (req, res, next) => {
  try {
    let { productName, amountAvailable, cost } = req.body;

    // Check if name is provided and it's a string
    if (!validator.checkIsNumber(productName)) {
      logger.error("The product name should be a string");
      return res
        .status(400)
        .send({ status: false, message: "Invalid product name.!" });
    }
    // Check if amount available is provided and it's a string or a number

    if (validator.checkIsNumber(amountAvailable)) {
      logger.error("The amount available should be a number not a string");
      return res.status(400).send({
        status: false,
        message: "Amount Available should be a numeric value",
      });
    }

    // check if cost is provided and it's a string or a number
    if (validator.checkIsNumber(cost)) {
      logger.error("The cost should be a number not a string");
      return res.status(400).send({
        status: false,
        message: "The Cost should be a Number.",
      });
    }

    // data is correct
    next();
  } catch (err) {
    logger.error(`Error in validateProductData middleware : ${err.message}`);
    // console.log("Error in validate Product Data middleware", err);
    res.status(500).send({
      status: false,
      message: "Internal Server Error..!",
    });
  }
};

// check if the role is seller
exports.isSeller = (req, res, next) => {
  try {
    // console.log(req.body);
    const { role } = req.body;
    if (!role.includes("seller")) {
      logger.error("The role should be seller the user.");
      return res.status(401).send({
        status: false,
        message: "You are not authorized to perform this action",
      });
    }
    next();
  } catch (err) {
    // console.error("Error in is Seller MiddleWare", err.message);
    logger.error(`Error in isSeller MiddleWare : ${err.message}`);
    res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};
