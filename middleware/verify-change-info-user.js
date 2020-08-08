const { compare } = require("bcryptjs");
const User = require("../models/user.model");
module.exports.verifyChangeInfoUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ error: "Invalid Email" });
  }

  try {
    const checkPassword = await compare(password,user.password);
    if(!checkPassword){
      return res.status(400).send({error:"Invalid Password"});
    }
    req.validatedUser = user;
    next();
  } catch (error) {
    res.status(404).send({error:"Something went wrong"})
  }
};
