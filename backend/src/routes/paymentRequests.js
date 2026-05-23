const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentRequestController');
const requireStaff = require('../middleware/requireStaff');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.listPendingForStaff));
router.post('/:id/approve', ...requireStaff, asyncHandler(ctrl.approveRequest));
router.post('/:id/reject', ...requireStaff, asyncHandler(ctrl.rejectRequest));

module.exports = router;
