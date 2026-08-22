const makeController = require('./resourceController');
const supplierService = require('../services/supplierService');

module.exports = makeController(supplierService);
