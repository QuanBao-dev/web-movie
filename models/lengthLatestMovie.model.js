const mongoose = require("mongoose");
const lengthLatestMovieSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  length: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("length-movie", lengthLatestMovieSchema);
