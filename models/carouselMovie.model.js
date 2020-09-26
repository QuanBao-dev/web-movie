const mongoose = require("mongoose");
const carouselMongooseSchema = new mongoose.Schema({
  data:{
    type:Array,
    required:true
  },
  name:{
    type:String,
    required:true
  }
})

module.exports = mongoose.model("carousel-movie",carouselMongooseSchema);