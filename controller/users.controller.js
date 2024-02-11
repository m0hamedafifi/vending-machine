const User = require("../model/users.model");
const util = require('../util/utility');
const bcrypt = require("bcryptjs");
const jwt = require('../Util/jwt.util');


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
    else lastIdUser = Number(lastIdUser.userId) + 1;
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
      role: req.body.role ? req.body.role : 'buyer',
    };
    // console.log(data);

    // check username is already exist or not already
    const userExistOrNot = await User.findOne({ userName: data.userName });
    if (userExistOrNot) {
      return res.status(409).send(`Username ${data.userName} already exists.`);
    }

    let newUser = new User(data);

    let dataUser = await newUser.save();

    // generate the token for authentication
    let token = jwt.generateToken(dataUser.userId,dataUser.userName,dataUser.role);
        
    // send response to client side

    return res.header('x-auth-token', token).status(201).send({
      status: true,
      message: `user : ${newUser.userName} has been added successfully!`,
      results: dataUser,
    });
  } catch (err) {
    console.log("Error at new  user creation", err.message);
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
    return res.status(200).send({
      status: true,
      message: "Successfully fetched the user list",
      results: records,
    });
  } catch (err) {
    console.log("Error in getting user list..!", err.message);
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
      return res.status(404).send({ status: false, message: "User not found" });
    }

    // If the user is found, send a successful response with user details
    return res.status(200).send({ status: true, results: record });
  } catch (err) {
    // Handle errors that may occur during the process
    console.log("Error In Fetching The User Data", err);
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
      return res
        .status(404)
        .json({ message: "No User Found With This Username." });
    }
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
      return res
        .status(400)
        .send({ status: false, message: "Please provide new data to update." });
    }

    if (updateOps.password) {
      updateOps.password = bcrypt.hashSync(updateOps.password, 10);
    }

    // Check if the user exists or not
    var user = await User.findOneAndUpdate(
      { $or: [{ userId: id }, { userName: id }] },
      updateOps,
      { new: true }
    );
    if (!user)
      return res
        .status(404)
        .send({ status: false, message: "No user with that ID." });

    return res
      .status(200)
      .send({ status: true, data: "User has been updated successfully!" });
  } catch (err) {
    console.log("Error in updating user info", err);
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
    let user = await User.findOneAndDelete({
      $or: [{ userId: id }, { userName: id }],
    });
    if (!user)
      return res.status(404).send({ status: false, message: "User Not Found!" });

    // Send success response
    res.status(200).send({ status: true, message: "User has been deleted!" });
  } catch (err) {
    console.log("Error In Deleting The User", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
