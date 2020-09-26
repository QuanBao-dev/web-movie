const { compare } = require("bcryptjs");
const User = require("../models/user.model");
const {
  changeInfoAccountValidationMiddleWare,
} = require("../validations/user.validation");
module.exports.verifyChangeInfoUser = async (req, res, next) => {
  const { email, password } = req.body;
  let data = {};
  data.email = req.body.email;
  data.currentPassword = req.body.password;
  const result = changeInfoAccountValidationMiddleWare(data);
  if (result.error) {
    return res.status(400).send({ error: result.error.details[0].message });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ error: "Invalid Email" });
  }

  try {
    const checkPassword = await compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).send({ error: "Invalid Current Password" });
    }
    req.validatedUser = user;
    next();
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
};
