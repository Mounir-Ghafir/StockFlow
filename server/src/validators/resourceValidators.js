const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const categorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
});

const supplierSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  email: Joi.string().trim().lowercase().email().required(),
  phone: Joi.string().trim().min(3).max(30).required(),
});

const productSchema = Joi.object({
  sku: Joi.string().trim().min(1).max(50).required(),
  name: Joi.string().trim().min(2).max(150).required(),
  category: objectId.required(),
  supplier: objectId.required(),
  price: Joi.number().min(0).required(),
  quantityInStock: Joi.number().integer().min(0).default(0),
  lowStockThreshold: Joi.number().integer().min(0).default(5),
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().max(100).allow(''),
  category: objectId,
  supplier: objectId,
  lowStock: Joi.boolean().truthy('true').falsy('false').default(false),
});

module.exports = { categorySchema, supplierSchema, productSchema, querySchema };
