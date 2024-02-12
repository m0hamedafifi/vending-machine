const express = require("express");
const router = express.Router();
const usersController = require("../controller/users.controller");
const loginController = require('../controller/login.controller');
// Middleware 
const authMW  = require('../middleware/authMWToken');
const validator = require('../middleware/validateUserDataMW');

// Create a new user
router.post("/users/add", validator.validRegData,validator.checkDepositUser,usersController.addNewUser);

// login with username and password
router.post("/users/login", loginController.signInWithUsernamePassword);

// Get all users
router.get("/users", usersController.getAllUsersList);

// Get specific user by id
router.get("/users/:id", usersController.getUserDetailsById);

// Update existing user
router.put("/users/:id",authMW.authenticateUser, validator.checkUser,validator.checkDepositUser,usersController.updateUserInfo);

// Delete user
router.delete("/users/:id",authMW.authenticateUser,validator.checkUser, usersController.deleteUser);

module.exports = router;
