const mongoose = require("mongoose");
const theaterMemberRoomSchema = new mongoose.Schema({
  groupId:{
    type:String,
    required:true,
  },
  keepRemote:{
    type:Boolean,
    default:false
  },
  joinAt:{
    type:Number,
    default:Date.now
  },
  userId:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model("theater-room-member", theaterMemberRoomSchema);
