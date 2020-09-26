const Joi = require("@hapi/joi");

const createRoomValidation = (data) => {
  const schema = Joi.object({
    roomName: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.createRoomValidation = createRoomValidation;
