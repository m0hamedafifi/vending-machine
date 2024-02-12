const validator = require("../util/validations");
const Logger = require("../services/logger");

//----------------------------------------------------------------
// add new logger object to the Middleware
//----------------------------------------------------------------
const logger = new Logger("UserDataValidationMW");

// Exporting the validRegData middleware function which will validate the registration data
exports.validRegData = async (req, res, next) => {
  try {
    const { userName, password, role } = req.body;

    // Checking if any of the required fields are missing
    if (!userName || !password) {
      logger.error("Please enter a username and password.");
      return res
        .status(400)
        .send({ status: false, message: "Please fill username or  password" });
    }

    //checking the length and validation of user name
    if (userName.length < 4) {
      logger.error(
        "Please enter a username  that is at least 4 characters long."
      );
      return res.status(400).send({
        status: false,
        message: "Username should be at least 4 characters",
      });
    }

    // check for special character in username
    if (!validator.isValidUserName(userName)) {
      logger.error(`Invalid Username : ${userName}`);
      return res.status(400).send({
        status: false,
        message:
          "Username should only contains letters ,numbers and underscores.",
      });
    }

    // check role type
    if (typeof role === "string") {
      // Validating the role field
      if (!validator.isRoleExists(role.toLowerCase())) {
        logger.error(`Invalid Role : ${role} `);
        return res.status(400).send({
          status: false,
          message: "This role does not exist",
        });
      }
    } else if (typeof role === "object") {
      for (let item of role) {
        if (!validator.isRoleExists(item.toLowerCase())) {
          logger.error(`Invalid Role : ${item.toLowerCase()}`);
          return res.status(400).send({
            status: false,
            message: "One or more roles provided do not exists.",
          });
        }
      }
    } else if (typeof role !== "undefined") {
      logger.error("Invalid data type of role");
      return res.status(422).send({
        status: false,
        message: "Invalid data sent to the server.",
      });
    }

    // checking password
    let validPassword = validator.isValidPassword(password);
    // checking password strength
    if (validPassword.length > 0) {
      let errList = validPassword.map((item) => ({
        detail: item.message,
      }));
      logger.error(`Invalid Password : ${JSON.stringify(errList)}`);
      return res.status(400).send({
        status: false,
        message: "Your Password must be strong",
        results: errList,
      });
    }

    // If all validations pass, moving on to the next middleware function
    next();
  } catch (err) {
    // console.log("Error In User Signup Validation", err);
    logger.error(`Error In User Signup Validation : ${err.message}`);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

// check the deposit data for validations before adding it into database
exports.checkDepositData = async (req, res, next) => {
  try {
    const { deposit } = req.body;

    // Check the deposit data is exist or not
    if (!deposit) {
      logger.error(`Deposit data not found in request body.`);
      return res.status(422).send({
        status: false,
        message:
          "Please provide a valid deposit of money you want to add in your account.",
      });
    }
    // Check the deposit data is in number format or not
    if (validator.checkIsNumber(deposit)) {
      logger.error(`The value of Deposit should be a Number.`);
      return res.status(400).send({
        status: false,
        message: "The amount should be a Number",
      });
    }

    // Checking whether the amount is 5 or 10 or 20 or  50 or 100 only
    if (!validator.isValidDeposit(deposit)) {
      logger.error(`Invalid Amount Provided For Deposit`);
      return res.status(400).send({
        status: false,
        message: "Invalid Deposit Amount it's accept 5,10,20,50,100 only",
      });
    }

    // then it's accepted
    next();
  } catch (err) {
    // console.log("Error in checking deposit data", err);
    logger.error(`Error in checking deposit data : ${err.message}`);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error..!",
    });
  }
};

// Checks whether the deposit for new user or update

exports.checkDepositUser = async (req, res, next) => {
  try {
    let deposit  = req.body.deposit;

    // Check the deposit data is exist or not
    if (!deposit) {
      next();
      return;
    }
    // Check the deposit data is in number format or not
    if (validator.checkIsNumber(deposit)) {
      logger.error(`The value of Deposit should be a Number.`);
      return res.status(400).send({
        status: false,
        message: "The amount should be a Number",
      });
    }

    // Checking whether the amount is 5 or 10 or 20 or  50 or 100 only
    if (!validator.isValidDeposit(deposit)) {
      logger.error(`Invalid Amount Provided For Deposit`);
      return res.status(400).send({
        status: false,
        message: "Invalid Deposit Amount it's accept 5,10,20,50,100 only",
      });
    }

    // then it's accepted
    next();
  } catch (err) {
    // console.log("Error in checking deposit data", err);
    logger.error(
      `Error in checking deposit data for add user or update : ${err.message}`
    );
    return res.status(500).send({
      status: false,
      message: "Internal Server Error..!",
    });
  }
};

// it's same user or not
exports.checkUser = async (req, res, next) => {
  try {
    id = req.params.id;
    if (!(id == req.body.userId || id == req.body.userName)) {
      logger.error(`Unauthorized Access Attempted by User with ID : ${id} `);
      return res
        .status(404)
        .send({ status: false, message: "Unauthorized Access...!" });
    }
    next();
  } catch (err) {
    // console.log("Error in checking User Data", err);
    logger.error(`Error in checking User Data : ${err.message} `);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error..." });
  }
};

// check if the role is buyer
exports.isBuyer = (req, res, next) => {
  try {
    // console.log(req.body);
    const { role } = req.body;
    if (!role.includes("buyer")) {
      logger.error(
        `Unauthorized Access Attempted by User with ID : ${req.body.userId}`
      );
      return res.status(401).send({
        status: false,
        message: "You are not authorized to perform this action",
      });
    }
    next();
  } catch (err) {
    // console.error("Error in is buyer MiddleWare", err.message);
    logger.error(`Error in is buyer MiddleWare : ${err.message}`);
    res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

// check input data for buy transaction
exports.checkBuyData = (req, res, next) => {
  try {
    let { productId, amount } = req.body;
    // check if the product id is number not null and  is not empty
    if (isNaN(productId) || !productId) {
      logger.error(`Invalid Product Id : ${productId}`);
      return res.status(422).send({
        status: false,
        message: "Product Id must be a valid number.",
      });
    }
    // check the amount is  numeric and not null or empty string
    if (isNaN(amount) || !amount) {
      logger.error(`Invalid Amount : ${amount}`);
      return res.status(422).send({
        status: false,
        message: "Amount should be a valid number.",
      });
    }

    next();
  } catch (err) {
    // console.log("Error In Check Buy Data", err.message);
    logger.error(`Error In Check Buy Data : ${err.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
