const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tenantController');
const requireStaff = require('../middleware/requireStaff');
const requireWrite = require('../middleware/requireWrite');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireStaff, asyncHandler(ctrl.getAllTenants));
router.get('/:id', ...requireStaff, asyncHandler(ctrl.getTenantById));
router.post('/', requireWrite, asyncHandler(ctrl.createTenant));
router.put('/:id', requireWrite, asyncHandler(ctrl.updateTenant));
router.delete('/:id', requireWrite, asyncHandler(ctrl.deleteTenant));

module.exports = router;
