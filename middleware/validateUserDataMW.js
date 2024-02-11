const validator = require("../util/validations");

// Exporting the validRegData middleware function which will validate the registration data
exports.validRegData = async (req, res, next) => {
  try {
    const { userName, password, role, deposit } = req.body;

    // Checking if any of the required fields are missing
    if (!userName || !password) {
      return res
        .status(400)
        .send({ status: false, message: "Please fill username or  password" });
    }

    //checking the length and validation of user name
    if (userName.length < 4) {
      return res.status(400).send({
        status: false,
        message: "Username should be at least 4 characters",
      });
    }

    // check for special character in username
    if (!validator.isValidUserName(userName)) {
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
        return res.status(400).send({
          status: false,
          message: "This role does not exist",
        });
      }
    } else if (typeof role === "object") {
      for (let item of role) {
        if (!validator.isRoleExists(item.toLowerCase())) {
          return res.status(400).send({
            status: false,
            message: "One or more roles provided do not exists.",
          });
        }
      }
    } else if (typeof role !== "undefined") {
      return res.status(422).jsonp({
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
      return res.status(400).send({
        status: false,
        message: "Your Password must be strong",
        results: errList,
      });
    }

    // If all validations pass, moving on to the next middleware function
    next();
  } catch (err) {
    console.log("Error In User Signup Validation", err);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

// check the deposit data for validations before adding it into database
exports.checkDepositData = async (req, res, next) => {
  try {
    const { deposit, role } = req.body;

    // Check the deposit data is in number format or not
    if (validator.checkIsNumber(deposit)) {
      return res.status(400).send({
        status: false,
        message: "The amount should be a Number",
      });
    }

    // Checking whether the amount is 5 or 10 or 20 or  50 or 100 only
    if (!validator.isValidDeposit(deposit)) {
      return res.status(400).send({
        status: false,
        message: "Invalid Deposit Amount it's accept 5,10,20,50,100 only",
      });
    }

    // Checking role of user who is making a deposit
    if (!role.includes("buyer")) {
      return res.status(403).send({
        status: false,
        message: "You are not authorized to make this request",
      });
    }

    // then it's accepted
    next();
  } catch (err) {
    console.log("Error in checking deposit data", err);
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
      return res
        .status(404)
        .send({ status: false, message: "Unauthorized Access...!" });
    }
    next();
  } catch (err) {
    console.log("Error in checking User Data", err);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error..." });
  }
};
