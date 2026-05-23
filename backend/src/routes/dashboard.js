const express = require('express');
const router = express.Router();
const { getRoomsFloorPlan, getRoomDetail } = require('../controllers/dashboardController');
const requireStaff = require('../middleware/requireStaff');
const asyncHandler = require('../utils/asyncHandler');

// Get rooms floor plan view (staff only)
router.get('/floor-plan', ...requireStaff, asyncHandler(getRoomsFloorPlan));

// Get room detail (staff only)
router.get('/room/:id', ...requireStaff, asyncHandler(getRoomDetail));

module.exports = router;
