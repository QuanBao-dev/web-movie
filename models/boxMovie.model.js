const mongoose = require("mongoose");

const boxMovieSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  malId: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  episodes: { type: String, required: true },
  score: { type: String, required: true },
  synopsis: { type: String, required: true },
  airing: { type: Boolean, required: true },
  dateAdded: { type: Date, default: Date.now },
});

boxMovieSchema.pre("findOneAndUpdate",function(next){
  this._update.dateAdded = new Date(Date.now());
  next();
})

module.exports = mongoose.model("box-movie", boxMovieSchema);
