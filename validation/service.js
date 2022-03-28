const Joi = require("joi");

exports.validateService = (service) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(25).required(),
    title: Joi.string().required(),
  });
  return schema.validate(service);
};
