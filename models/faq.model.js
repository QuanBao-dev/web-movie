const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema({
  html:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  }
})

module.exports = mongoose.model("faq",faqSchema);