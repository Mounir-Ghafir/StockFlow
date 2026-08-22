const createResourceRouter = require('./resourceRoutes');
const controller = require('../controllers/productController');
const service = require('../services/productService');
const { productSchema, querySchema } = require('../validators/resourceValidators');

module.exports = createResourceRouter({ controller, service, schema: productSchema, querySchema });
