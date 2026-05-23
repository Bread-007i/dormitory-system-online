const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');

const requireAdmin = [authMiddleware, roleMiddleware('admin')];

module.exports = requireAdmin;
