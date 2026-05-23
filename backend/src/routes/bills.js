const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/billController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllBills));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getBillById));
router.post('/', requireWrite, asyncHandler(ctrl.createBill));
router.put('/:id', requireWrite, asyncHandler(ctrl.updateBill));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deleteBill));

module.exports = router;
