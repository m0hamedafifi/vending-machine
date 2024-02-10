const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true ,unique: true},
    deposit: { type: String, required: false },
    password: { type: String, required: true },
    role : [
        {
          type: String,
          enum: ["buyer", "seller"],
          default: ["buyer"],
        },
      ],
    userId: { type: String, required: true, unique: true },
  });
  const user = mongoose.model("users", userSchema);
  // create model
  module.exports = user;