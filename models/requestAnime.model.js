const mongoose = require("mongoose");

const requestAnimeSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  malId: { type: String, require: true },
  title: { type: String, require: true },
  imageUrl: { type: String, require: true },
  score: { type: String },
  synopsis: { type: String },
  usernames: {
    type: [String],
    default: [],
  },
});

requestAnimeSchema.pre("save", function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

module.exports = mongoose.model("request-anime", requestAnimeSchema);
