const mongoose = require("mongoose");
const magazineSchema = mongoose.Schema({
  mal_id: { type: Number, require: true },
  url: { type: String, require: true },
  name: { type: String, require: true },
  count: { type: Number, require: true },
});

module.exports = mongoose.model("magazine", magazineSchema);
