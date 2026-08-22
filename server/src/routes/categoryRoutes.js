const createResourceRouter = require('./resourceRoutes');
const controller = require('../controllers/categoryController');
const service = require('../services/categoryService');
const { categorySchema } = require('../validators/resourceValidators');

module.exports = createResourceRouter({ controller, service, schema: categorySchema });
