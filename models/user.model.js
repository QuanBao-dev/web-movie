const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const userSchema = new mongoose.Schema({
  userId:{
    type:String,
    default:nanoid
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "User",
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarImage: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

module.exports = mongoose.model("user", userSchema);
