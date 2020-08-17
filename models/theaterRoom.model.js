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
    default: nanoid(),
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model("theater-room", theaterRoomSchema);
