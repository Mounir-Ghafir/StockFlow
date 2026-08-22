const makeController = require('./resourceController');
const productService = require('../services/productService');

module.exports = makeController(productService);
