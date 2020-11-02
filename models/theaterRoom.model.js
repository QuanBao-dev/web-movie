const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const theaterRoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  lock: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    default: nanoid,
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  expiredAt:{
    type:Date,
    default:new Date(Date.now() + 43200000)
  }
});

module.exports = mongoose.model("theater-room", theaterRoomSchema);
