const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const purchaseOrderSchema = Joi.object({
  supplier: objectId.required(),
  items: Joi.array().items(Joi.object({
    product: objectId.required(),
    quantity: Joi.number().integer().min(1).required(),
    unitCost: Joi.number().min(0).required(),
  })).min(1).required(),
  status: Joi.string().valid('Draft', 'Ordered', 'Received', 'Cancelled').default('Draft'),
  expectedAt: Joi.date().iso().required(),
});

module.exports = { purchaseOrderSchema };
