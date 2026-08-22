const express = require('express');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const purchaseOrderController = require('../controllers/purchaseOrderController');
const { purchaseOrderSchema } = require('../validators/purchaseOrderValidators');

const router = express.Router();
router.use(authenticate, requireRole('Admin'));
router.get('/', purchaseOrderController.list);
router.get('/:id', purchaseOrderController.getById);
router.post('/', validate(purchaseOrderSchema), purchaseOrderController.create);
router.put('/:id', validate(purchaseOrderSchema), purchaseOrderController.update);
router.post('/:id/receive', purchaseOrderController.receive);
router.delete('/:id', purchaseOrderController.remove);

module.exports = router;
