const { verifyRole } = require("../middleware/verify-role");
const User = require("../models/user.model");
const router = require("express").Router();

router.get("/", verifyRole("User", "Admin"), async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId })
    .lean()
    .select({ _id: 0, username: 1, userId: 1, avatarImage:1, role:1 });
  //TODO  send userVm to define the role in client
  res.send({
    message: {
      ...user,
      avatarImage:
        user.avatarImage ||
        "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png",
    },
  });
});

module.exports = router;
