const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');

/** เพิ่ม/แก้/ลบ — Admin + Staff */
const requireWrite = [authMiddleware, roleMiddleware('admin', 'staff')];

module.exports = requireWrite;
