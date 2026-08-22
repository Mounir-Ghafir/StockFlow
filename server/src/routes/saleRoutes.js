const express = require('express');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const saleController = require('../controllers/saleController');
const { saleSchema } = require('../validators/salesValidators');

const router = express.Router();
router.use(authenticate);
router.post('/', validate(saleSchema), saleController.create);
router.get('/', saleController.list);
router.get('/:id', saleController.getById);

module.exports = router;
