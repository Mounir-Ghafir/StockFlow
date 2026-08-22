const express = require('express');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();
router.get('/summary', authenticate, requireRole('Admin'), dashboardController.summary);

module.exports = router;
