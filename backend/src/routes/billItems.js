const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/billItemController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllBillItems));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getBillItemById));
router.post('/', requireWrite, asyncHandler(ctrl.createBillItem));
router.put('/:id', requireWrite, asyncHandler(ctrl.updateBillItem));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deleteBillItem));

module.exports = router;
