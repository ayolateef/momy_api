const Joi = require("joi");

exports.validateLogin = (req) => {
  const schema = Joi.object({
    phone: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
};
exports.validateSignUp = (req) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    phone: Joi.string().min(11).max(255).optional(),
  });
  return schema.validate(req);
};
