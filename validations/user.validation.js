const Joi = require("@hapi/joi");

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    username: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const changeInfoAccountValidation = (data) => {
  const schema = Joi.object({
    email:Joi.string().min(6).email(),
    password:Joi.string().min(6),
    username:Joi.string().min(6),
    avatarImage:Joi.string()
  });
  return schema.validate(data);
}
module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
module.exports.changeInfoAccountValidation = changeInfoAccountValidation;
