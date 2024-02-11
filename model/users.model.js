const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  deposit: { type: String, required: false },
  password: { type: String, required: true },
  role: [
    {
      type: String,
      enum: ["buyer", "seller"],
      default: ["buyer"],
      lowercase: true,
      trim: true,
    },
  ],
  userId: { type: Number, required: true, unique: true },
});
const user = mongoose.model("users", userSchema);
// create model
module.exports = user;
