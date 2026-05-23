const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/maintenanceController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllMaintenance));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getMaintenanceById));
router.post('/', requireWrite, asyncHandler(ctrl.createMaintenance));
router.put('/:id', requireWrite, asyncHandler(ctrl.updateMaintenance));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deleteMaintenance));

module.exports = router;
