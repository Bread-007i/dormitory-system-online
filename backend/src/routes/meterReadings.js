const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/meterReadingController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllMeterReadings));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getMeterReadingById));
router.post('/', requireWrite, asyncHandler(ctrl.createMeterReading));
router.put('/:id', requireWrite, asyncHandler(ctrl.updateMeterReading));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deleteMeterReading));

module.exports = router;
