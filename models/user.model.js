const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  boxMovie: {
    type: [String],
    default: [],
  },
});

userSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date(Date.now());
  next();
});

module.exports = mongoose.model("users", userSchema);
