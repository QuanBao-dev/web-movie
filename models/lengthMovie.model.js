const mongoose = require("mongoose");
const lengthMovieSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  length_updated_movies: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("length-movie", lengthMovieSchema);
