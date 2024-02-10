const express = require("express");
const router = express.Router();
const usersController = require("../controller/users.controller");

// Create a new user
router.post("/users/add", usersController.addNewUser);

// Get all users
router.get("/users", usersController.getAllUsersList);

// Get specific user by id

router.get("/users/:id", usersController.getUserDetailsById);

// Update existing user
router.put("/users/:id", usersController.updateUserInfo);

// Delete user
router.delete("/users/:id", usersController.deleteUser);

module.exports = router;
