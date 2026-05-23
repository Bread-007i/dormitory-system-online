const db = require('../config/db');

async function getTenantProfileByUserId(userId) {
  const [users] = await db.query(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [userId]
  );
  if (!users.length) return null;

  const [tenants] = await db.query(
    `SELECT t.*, r.id as room_id, r.room_number, r.room_type, r.rent_price, r.status as room_status,
            a.id as apartment_id, a.name as apartment_name, a.address, a.city
     FROM tenants t
     LEFT JOIN rooms r ON t.room_id = r.id
     LEFT JOIN apartments a ON r.apartment_id = a.id
     WHERE t.email = ?`,
    [users[0].email]
  );

  if (!tenants.length) return { user: users[0], tenant: null };

  return { user: users[0], tenant: tenants[0] };
}

module.exports = { getTenantProfileByUserId };
