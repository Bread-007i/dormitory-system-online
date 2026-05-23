const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');

/** Admin + Staff — จัดการหอพัก (ไม่รวมผู้เช่า) */
const requireStaff = [authMiddleware, roleMiddleware('admin', 'staff')];

module.exports = requireStaff;
