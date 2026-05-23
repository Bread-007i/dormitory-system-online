const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/apartmentController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllApartments));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getApartmentById));
router.post('/', requireWrite, asyncHandler(ctrl.createApartment));
router.put('/:id', requireWrite, asyncHandler(ctrl.updateApartment));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deleteApartment));

module.exports = router;
