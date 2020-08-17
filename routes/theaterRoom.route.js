const { nanoid } = require("nanoid");
const { verifyRole } = require("../middleware/verify-role");
const TheaterRoom = require("../models/theaterRoom.model");
const ignoreProps = require("../validations/ignore.validation");

const router = require("express").Router();

router.get("/", verifyRole("User", "Admin"), async (req, res) => {
  //TODO get all rooms
  const rooms = await TheaterRoom.find().lean().select({
    roomName: 1,
    _id: false,
    groupId: 1,
    createdAt: 1,
  });
  try {
    res.send({ message: rooms });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/:groupId", verifyRole("User", "Admin"), async (req, res) => {
  const room = await TheaterRoom.findOne({ groupId: req.params.groupId })
    .lean()
    .select({
      roomName: 1,
      _id: false,
      groupId: 1,
      createdAt: 1,
    });
  if (!room) {
    return res.status(400).send({ error: "Something went wrong" });
  }
  try {
    res.send({ message: room });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.post("/", verifyRole("User", "Admin"), async (req, res) => {
  //TODO create new Room
  const { roomName, password } = req.body;
  const room = await TheaterRoom.create({
    roomName,
    password,
    groupId: nanoid(),
  });
  try {
    res.send({ message: ignoreProps(["_id", "__v"], room.toJSON()) });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.post("/:groupId/join", verifyRole("User", "Admin"), async (req, res) => {
  const { groupId } = req.params;
  const { password } = req.body;
  try {
    const room = await TheaterRoom.findOne({ groupId }).lean();
    if (password !== room.password) {
      return res.status(401).send({ message: "Invalid password" });
    }
    res.send({ message: "Success" });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.delete("/:groupId", verifyRole("User", "Admin"), async (req, res) => {
  //TODO delete one room
  try {
    const room = await TheaterRoom.findOneAndRemove({
      groupId: req.params.groupId,
    })
      .lean()
      .select({ _id: false, roomName: 1 });
    res.send({ message: room });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

module.exports = router;
