const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/utilityController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllUtilities));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getUtilityById));
router.post('/', requireWrite, asyncHandler(ctrl.createUtility));
router.put('/:id', requireWrite, asyncHandler(ctrl.updateUtility));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deleteUtility));

module.exports = router;
