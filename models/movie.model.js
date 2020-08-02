const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  malId: {
    type: String,
    require: true,
  },
  episodes: {
    type: [
      {
        episode: Number,
        videoUrl: String,
        source: String,
        type: String,
      },
    ],
    default: [],
  },
  messages: {
    type: [
      {
        createdAt: Date,
        author: String,
        time: Date,
        textContent: String,
        marginLeft: String,
      },
    ],
    default: [],
  },
});

movieSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date(Date.now());
  next();
});

module.exports = mongoose.model("movies", movieSchema);
