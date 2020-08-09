const mongoose = require("mongoose");

const updatedMovieSchema = new mongoose.Schema({
  malId: String,
  title: String,
  imageUrl: String,
  numEpisodes: String,
  score: String,
  updatedAt: { type: Date, default: Date.now },
});

updatedMovieSchema.pre("save",function(next){
  this.updatedAt= new Date(Date.now());
  next()
})

updatedMovieSchema.pre("findOneAndUpdate",function(next){
  this._update.updatedAt= new Date(Date.now());
  next()
})

module.exports = mongoose.model("updatedMovie", updatedMovieSchema);
