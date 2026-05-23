const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const requireAdmin = require('../middleware/requireAdmin');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', ...requireAdmin, asyncHandler(ctrl.getAllUsers));
router.get('/:id', ...requireAdmin, asyncHandler(ctrl.getUserById));
router.post('/', ...requireAdmin, asyncHandler(ctrl.createUser));
router.put('/:id', ...requireAdmin, asyncHandler(ctrl.updateUser));
router.delete('/:id', ...requireAdmin, asyncHandler(ctrl.deleteUser));

module.exports = router;
