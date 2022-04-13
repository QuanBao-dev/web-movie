const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const lengthMovieSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  length: {
    type: Number,
    require: true,
  },
  userId: {
    type: String,
    default: nanoid,
  },
});

module.exports = mongoose.model("length-movie", lengthMovieSchema);
