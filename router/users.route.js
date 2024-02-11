const express = require("express");
const router = express.Router();
const usersController = require("../controller/users.controller");
const loginController = require('../controller/login.controller');
// Middleware 
const authMW  = require('../middleware/authMWToken');

// Create a new user
router.post("/users/add", usersController.addNewUser);

// login with username and password
router.post("/users/login", loginController.signInWithUsernamePassword);

// Get all users
router.get("/users", usersController.getAllUsersList);

// Get specific user by id
router.get("/users/:id", usersController.getUserDetailsById);

// Update existing user
router.put("/users/:id",authMW.authenticateUser, usersController.updateUserInfo);

// Delete user
router.delete("/users/:id",authMW.authenticateUser, usersController.deleteUser);

module.exports = router;
