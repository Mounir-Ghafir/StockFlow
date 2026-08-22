const makeController = require('./resourceController');
const categoryService = require('../services/categoryService');

module.exports = makeController(categoryService);
