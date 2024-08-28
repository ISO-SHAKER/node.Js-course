const mongoose = require("mongoose");
const validator = require("validator");

const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,

    validate: [validator.isEmail, "invalid email address"],
  },

  password: {
    type: String,
    required: true,
  },

  avatar: {
    type: String,
    default: "uploads/avatar.jpg",
  },

  token: {
    type: String,
  },

  role: {
    type: String,
    enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
    default: userRoles.USER,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
