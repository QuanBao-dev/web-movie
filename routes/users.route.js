const router = require("express").Router();
const {
  loginValidation,
  registerValidation,
} = require("../validations/user.validation");
const User = require("../models/user.model");
const { compare } = require("bcryptjs");
const bcrypt = require("bcryptjs");
const ignoreProps = require("../validations/ignore.validation");
const jwt = require("jsonwebtoken");
const { verifyRole } = require("../middleware/verify-role");
const { verifyLogin } = require("../middleware/verify-login");

router.get("/", verifyRole("Admin"), async (req, res) => {
  //TODO Get all user if you are admin
  try {
    const users = await User.find({});
    res.send({
      message: users.map((user) => user.toJSON()),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/id", verifyRole("Admin", "User"), async (req, res) => {
  //TODO Get all user if you are admin
  const { email } = req.user;
  try {
    const user = await User.findOne({ email });
    res.send({
      message: user.id
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.post("/login", verifyLogin, async (req, res) => {
  const result = loginValidation(req.body);
  if (result.error) {
    return res.status(400).send({ error: result.error.details[0].message });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ error: "Account doesn't exist" });
  }
  const checkPassword = await compare(password, user.password);
  if (!checkPassword) {
    return res.status(400).send({ error: "Invalid password" });
  }
  const userVm = ignoreProps(["_id", "__v", "password"], user.toJSON());
  try {
    const token = jwt.sign(userVm, process.env.JWT_KEY, {
      expiresIn: "12h",
    });
    res.cookie("idCartoonUser", token, {
      expires: new Date(Date.now() + 43200000),
      path: "/",
      signed: true,
    });
    res.send({ message: token });
  } catch {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.post("/register", verifyLogin, async (req, res) => {
  const result = registerValidation(req.body);
  if (result.error) {
    return res.status(400).send({ error: result.error.details[0].message });
  }
  const { username, email, password } = req.body;
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return res.status(400).send({ error: "Email already existed" });
  }
  const newUser = new User({ username, email });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  try {
    const savedUser = await newUser.save();
    res.send({
      message: ignoreProps(["_id", "__v", "password"], savedUser.toJSON()),
    });
  } catch {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.delete("/logout", verifyRole("Admin", "User"), (req, res) => {
  res.cookie("idCartoonUser", "", {
    expires: new Date(Date.now() - 43200000),
    path: "/",
    signed: true,
  });
  res.send({ message: "Log out success" });
});

router.put("/:id", verifyRole("Admin", "User"), async (req, res) => {
  //TODO modify only your user info
  const { id } = req.params;
  const user = await User.findById(id);
  const userSignIn = req.user;
  if (user.email !== userSignIn.email) {
    return res
      .status(400)
      .send({ error: "Can't change information of other user" });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.send({
      message: ignoreProps(["_id", "__v", "password"], user.toJSON()),
    });
  } catch {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.delete("/:id", verifyRole("Admin"), async (req, res) => {
  //TODO delete any user you want when you got permission Admin role
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id, req.body);
    res.send({
      message: ignoreProps(["id", "__v", "password"], user.toJSON()),
    });
  } catch {
    res.status(404).send({ error: "Something went wrong" });
  }
});

module.exports = router;
