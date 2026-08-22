const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const saleSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    product: objectId.required(),
    quantity: Joi.number().integer().min(1).required(),
  })).min(1).required(),
});

module.exports = { saleSchema };
