const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllPayments));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getPaymentById));
router.post('/', requireWrite, asyncHandler(ctrl.createPayment));
router.put('/:id', requireWrite, asyncHandler(ctrl.updatePayment));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deletePayment));

module.exports = router;
