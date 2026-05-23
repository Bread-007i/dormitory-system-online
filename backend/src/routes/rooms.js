const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/roomController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllRooms));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getRoomById));
router.post('/', requireWrite, asyncHandler(ctrl.createRoom));
router.put('/:id', requireWrite, asyncHandler(ctrl.updateRoom));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deleteRoom));

module.exports = router;
