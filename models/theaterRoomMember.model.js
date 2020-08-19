const mongoose = require("mongoose");
const theaterMemberRoomSchema = new mongoose.Schema({
  groupId:{
    type:String,
    required:true,
  },
  joinAt:{
    type:Number,
    default:Date.now
  },
  userId:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model("theater-room-member", theaterMemberRoomSchema);
