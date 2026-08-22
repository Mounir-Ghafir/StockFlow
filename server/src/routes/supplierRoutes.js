const createResourceRouter = require('./resourceRoutes');
const controller = require('../controllers/supplierController');
const service = require('../services/supplierService');
const { supplierSchema } = require('../validators/resourceValidators');

module.exports = createResourceRouter({ controller, service, schema: supplierSchema });
