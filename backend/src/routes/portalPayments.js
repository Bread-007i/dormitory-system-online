const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentRequestController');
const requireTenant = require('../middleware/requireTenant');
const uploadSlip = require('../middleware/uploadSlip');
const asyncHandler = require('../utils/asyncHandler');

router.post('/request', ...requireTenant, asyncHandler(ctrl.createPaymentRequest));
router.get('/request/:id', ...requireTenant, asyncHandler(ctrl.getPaymentRequest));
router.post(
  '/request/:id/slip',
  ...requireTenant,
  uploadSlip.single('slip'),
  asyncHandler(ctrl.uploadSlip)
);

module.exports = router;
