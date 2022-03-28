const Joi = require("joi");

exports.validateOrder = (order) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    order_listId: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          qty: Joi.number().required(),
        })
      )
      .required(),
  });
  return schema.validate(order);
};
