const router = require("express").Router();
const {
  loginValidation,
  registerValidation,
  changeInfoAccountValidation,
} = require("../validations/user.validation");
const User = require("../models/user.model");
const { compare } = require("bcryptjs");
const bcrypt = require("bcryptjs");
const ignoreProps = require("../validations/ignore.validation");
const jwt = require("jsonwebtoken");
const { verifyRole } = require("../middleware/verify-role");
const { verifyLogin } = require("../middleware/verify-login");
const BoxMovie = require("../models/boxMovie.model");
const {
  verifyChangeInfoUser,
} = require("../middleware/verify-change-info-user");

router.get("/", verifyRole("Admin"), async (req, res) => {
  try {
    const users = await User.find({});
    res.send({
      message: users.map((user) =>
        ignoreProps(["password", "__v"], user.toJSON())
      ),
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
    let options = {
      expires: new Date(Date.now() + 43200000),
      path: "/",
      signed: true,
      secure: false,
    };
    if (process.env.NODE_ENV === "production") {
      options = {
        ...options,
        httpOnly: true,
      };
    }
    res.cookie("idCartoonUser", token, options);
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
  let options = {
    expires: new Date(Date.now() + 43200000),
    path: "/",
    signed: true,
  };
  if (process.env.NODE_ENV === "production") {
    options = {
      ...options,
      httpOnly: true,
    };
  }

  res.cookie("idCartoonUser", "", options);
  res.send({ message: "Log out success" });
});

router.put(
  "/current",
  verifyRole("Admin", "User"),
  verifyChangeInfoUser,
  async (req, res) => {
    let data = {};
    if (req.body.newEmail) {
      data = {
        ...data,
        email: req.body.newEmail,
      };
    }
    if (req.body.newUsername) {
      data = {
        ...data,
        username: req.body.newUsername,
      };
    }
    if (req.body.newPassword) {
      data = {
        ...data,
        password: req.body.newPassword,
      };
    }

    const result = changeInfoAccountValidation(data);
    if (result.error) {
      return res.status(400).send({ error: result.error.details[0].message });
    }
    const user = req.validatedUser;
    if (req.body.newUsername) {
      user.username = req.body.newUsername;
    }
    if (req.body.newEmail) {
      user.email = req.body.newEmail;
    }
    const emailExist = await User.findOne({ email: req.body.newEmail });
    if (emailExist) {
      return res.status(400).send({ error: "Email already existed" });
    }
    if (req.body.newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);
    }
    ///change cookie
    try {
      const userSaved = await user.save();
      const userVm = ignoreProps(
        ["_id", "__v", "password"],
        userSaved.toJSON()
      );
      const token = jwt.sign(userVm, process.env.JWT_KEY);
      let options = {
        expires: new Date(Date.now() + 43200000),
        path: "/",
        signed: true,
        secure: false,
      };
      if (process.env.NODE_ENV === "production") {
        options = {
          ...options,
          httpOnly: true,
        };
      }
      res.cookie("idCartoonUser", token, options);
      res.send({
        message: token,
      });
    } catch {
      res.status(404).send({ error: "Something went wrong" });
    }
  }
);

router.delete("/:id", verifyRole("Admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id, req.body);
    const deleteBoxMovie = await BoxMovie.deleteMany({ user: id });
    console.log(deleteBoxMovie.n);
    res.send({
      message: ignoreProps(["_id", "__v", "password"], user.toJSON()),
    });
  } catch {
    res.status(404).send({ error: "Something went wrong" });
  }
});

module.exports = router;
