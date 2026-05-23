const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const asyncHandler = require('../utils/asyncHandler');
const { registerRules, loginRules } = require('../validators/authValidators');

router.post(
  '/register',
  registerRules,
  validateRequest,
  asyncHandler(authController.register)
);

router.post(
  '/login',
  loginRules,
  validateRequest,
  asyncHandler(authController.login)
);

router.get('/me', authMiddleware, asyncHandler(authController.getMe));

module.exports = router;
