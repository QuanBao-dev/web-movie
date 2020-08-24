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
  sourceFilm:{
    type:String,
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
  episodes:{
    type:[
      {
        episode:Number,
        embedUrl:String,
      }
    ],
    default:[],
  },
});

movieSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date(Date.now());
  next();
});

module.exports = mongoose.model("movie", movieSchema);
