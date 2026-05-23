const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portalController');
const requireTenant = require('../middleware/requireTenant');
const asyncHandler = require('../utils/asyncHandler');

router.get('/overview', ...requireTenant, asyncHandler(portalController.getOverview));
router.get('/room', ...requireTenant, asyncHandler(portalController.getMyRoom));
router.get('/bills', ...requireTenant, asyncHandler(portalController.getMyBills));
router.get('/bills/:id', ...requireTenant, asyncHandler(portalController.getMyBillDetail));
router.get('/payments', ...requireTenant, asyncHandler(portalController.getMyPayments));
router.get('/maintenance', ...requireTenant, asyncHandler(portalController.getMyMaintenance));
router.post('/maintenance', ...requireTenant, asyncHandler(portalController.createMyMaintenance));

module.exports = router;
