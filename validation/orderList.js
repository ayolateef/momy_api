const Joi = require("joi");

exports.validateOrderList = (OrderList) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(25).required(),
    price: Joi.number().required(),
    serviceId: Joi.string(),
    quantity: Joi.number().required(),
    sex: Joi.string().required(),
  });
  return schema.validate(OrderList);
};
