const mongoose = require("mongoose");
const theaterMemberRoomSchema = new mongoose.Schema({
  groupId:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
  },
  joinAt:{
    type:String,
    default:Date.now
  }
});

module.exports = mongoose.model("theater-room-member", theaterMemberRoomSchema);
