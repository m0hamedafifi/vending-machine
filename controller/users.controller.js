const User = require("../model/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("../util/jwt.util");
const util = require("../util/utility");
const Logger = require("../services/logger");

//----------------------------------------------------------------
// add object from logger service methods and the filename
//----------------------------------------------------------------
const logger = new Logger("UserController");
// ----------------------------------------------------------------
//                        CRUD Operations
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// Create a new user in the database
// ----------------------------------------------------------------

exports.addNewUser = async (req, res) => {
  try {
    // get the latest id of the user from the users collection and increment it by one to create a unique id for the new user
    let lastIdUser = await User.findOne().sort({ userId: "desc" }).exec();
    if (!lastIdUser) lastIdUser = 1;
    else lastIdUser = lastIdUser.userId + 1;
    req.body.userId = lastIdUser;

    // encrypt password and update request body with encrypted password
    const salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    let data = {
      userId: req.body.userId,
      userName: req.body.userName,
      deposit: req.body.deposit,
      password: req.body.password,
      createdOn: util.dateFormat(),
      //role
      role: req.body.role ? req.body.role : "buyer",
    };
    // console.log(data);

    // check username is already exist or not already
    const userExistOrNot = await User.findOne({ userName: data.userName });
    if (userExistOrNot) {
      logger.error(`Username ${data.userName} already exists.`);
      return res.status(409).send(`Username ${data.userName} already exists.`);
    }

    let newUser = new User(data);

    let dataUser = await newUser.save();

    // generate the token for authentication
    let token = jwt.generateToken(
      dataUser.userId,
      dataUser.userName,
      dataUser.role
    );
    //add logger

    logger.info(
      `user : ${newUser.userName} has been added successfully!`,
      dataUser
    );
    // send response to client side
    return res
      .header("x-auth-token", token)
      .status(201)
      .send({
        status: true,
        message: `user : ${newUser.userName} has been added successfully!`,
        results: dataUser,
      });
  } catch (err) {
    // console.log("Error at new  user creation", err.message);
    logger.error(`Error at new  user creation ${err.message}`);
    return res.status(500).send({
      status: false,
      message: "Internal server error...!",
    });
  }
};

// ----------------------------------------------------------------
// Get all users list
// ----------------------------------------------------------------

exports.getAllUsersList = async function (req, res) {
  try {
    let records = await User.find({}, { _id: 0, __v: 0, password: 0 }).sort({
      userId: "asc",
      userName: "asc",
    });
    logger.info(`"Successfully fetched the user list"`);
    return res.status(200).send({
      status: true,
      message: "Successfully fetched the user list",
      results: records,
    });
  } catch (err) {
    // console.log("Error in getting user list..!", err.message);
    logger.error(`Error in getting user list..! ${err.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal server error...!",
    });
  }
};

// ----------------------------------------------------------------
// Get Single User Details By ID
// ----------------------------------------------------------------

exports.getUserDetailsById = async function (req, res) {
  try {
    // Extract user ID from request parameters
    const id = req.params.id;

    // Use findOne to find a user by ID and project only selected fields
    let record = await User.findOne(
      { $or: [{ userId: id }, { userName: id }] },
      {
        userName: 1,
        deposit: 1,
        role: 1,
        userId: 1,
      }
    );

    // If no user is found with the provided ID
    if (!record) {
      logger.error("Couldn't find user details for given ID");
      return res.status(404).send({ status: false, message: "User not found" });
    }

    logger.info("User details successfully retrieved by user id!", record);
    // If the user is found, send a successful response with user details
    return res.status(200).send({ status: true, results: record });
  } catch (err) {
    // Handle errors that may occur during the process
    // console.log("Error In Fetching The User Data", err.message);
    logger.error(`Error in fetching user data : ${err.message}`);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error...!" });
  }
};

// ----------------------------------------------------------------
// Get Single User Details By userName
// ----------------------------------------------------------------
exports.getUserDetailsByUserName = async function (req, res) {
  try {
    // Find a single user by username
    let userData = await User.findOne(
      { userName: req.body.userName },
      {
        userName: 1,
        deposit: 1,
        role: 1,
      }
    );
    if (!userData) {
      logger.error(`User ${req.body.userName} does not exist`);
      return res
        .status(404)
        .json({ message: "No User Found With This Username." });
    }
    logger.info("Successfully got user detail using user name.", userData);
    // If the user is found, send a successful response with user details
    return res.status(200).send({ status: true, results: userData });
  } catch {
    return res.status(500).json({ message: "Internal server error.." });
  }
};

// ----------------------------------------------------------------
// Update an existing user's information
// ----------------------------------------------------------------
exports.updateUserInfo = async function (req, res) {
  try {
    const id = req.params.id;
    const updateOps = req.body;
    if (!updateOps) {
      logger.error(`Invalid payload to update user info.`);
      return res
        .status(400)
        .send({ status: false, message: "Please provide new data to update." });
    }

    if (updateOps.password) {
      updateOps.password = bcrypt.hashSync(updateOps.password, 10);
    }
    let user = "";
    // check if  id is number or string
    if (!isNaN(id)) {
      // Check if the user exists or not
      user = await User.findOneAndUpdate({ userId: id }, updateOps, {
        new: true,
      });
    } else {
      user = await User.findOneAndUpdate({ userName: id }, updateOps, {
        new: true,
      });
    }
    // console.log(user);
    if (!user) {
      logger.error(`No user with that ID or Username.`);
      return res
        .status(404)
        .send({ status: false, message: "No user with that ID or username." });
    }
    logger.info("Successfully updated user info.", user);
    return res
      .status(200)
      .send({ status: true, data: "User has been updated successfully!" });
  } catch (err) {
    // console.log("Error in updating user info", err);
    logger.error(
      `Internal error occurred while updating user info : ${err.message}`
    );
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

// ----------------------------------------------------------------
// Delete User Profile
// ----------------------------------------------------------------
exports.deleteUser = async function (req, res) {
  try {
    const id = req.params.id;
    let user = "";
    // check if  id is number or string
    if (!isNaN(id)) {
      // remove by userName
      user = await User.findOneAndDelete({
        userId: id,
      });
    } else {
      // remove by user
      user = await User.findOneAndDelete({ userName: id });
    }

    if (!user) {
      logger.error(`User not found for deletion`);
      return res
        .status(404)
        .send({ status: false, message: "User Not Found!" });
    }
    logger.info(
      `User deleted Successfully [${user.userId}] , [${user.userName}] `
    );
    // Send success response
    res.status(200).send({ status: true, message: "User has been deleted!" });
  } catch (err) {
    // console.log("Error In Deleting The User", err);
    logger.error(
      `Internal error occurred while deleting the user : ${err.message}`
    );
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
