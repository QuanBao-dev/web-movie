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
  sourceFilm: {
    type: String,
  },
  sourceFilmList: {
    type: mongoose.Schema({
      episodes:String,
      episodesEng:String,
      episodesEngDub:String,
    }),
    default: {
      episodes: "",
      episodesEng: "",
      episodesEngDub: "",
    },
  },
  malId: {
    type: String,
    require: true,
  },
  messages: {
    type: [
      {
        createdAt: Date,
        author: String,
        textContent: String,
        marginLeft: String,
      },
    ],
    default: [],
  },
  episodes: {
    type: [
      {
        episode: String,
        embedUrl: String,
        typeVideo: Boolean,
      },
    ],
    default: [],
  },
  episodesEng: {
    type: [
      {
        episode: String,
        embedUrl: String,
        typeVideo: Boolean,
      },
    ],
    default: [],
  },
  episodesEngDub: {
    type: [
      {
        episode: String,
        embedUrl: String,
        typeVideo: Boolean,
      },
    ],
    default: [],
  },
});

movieSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date(Date.now());
  next();
});

module.exports = mongoose.model("movie", movieSchema);
