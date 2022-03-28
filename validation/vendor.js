const Joi = require("joi");

exports.validateVendor = (vendor) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(vendor);
};
