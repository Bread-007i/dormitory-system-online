const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contractController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllContracts));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getContractById));
router.post('/', requireWrite, asyncHandler(ctrl.createContract));
router.put('/:id', requireWrite, asyncHandler(ctrl.updateContract));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deleteContract));

module.exports = router;
