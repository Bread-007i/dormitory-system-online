const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');

const requireTenant = [authMiddleware, roleMiddleware('tenant')];

module.exports = requireTenant;
