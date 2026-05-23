/**
 * ตั้งรหัสผ่านทดสอบ + บทบาท admin / staff / tenant
 * รัน: npm run seed:users
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

const DEV_PASSWORD = '123456';

const TEST_USERS = [
  { name: 'Admin', email: 'admin@dormitory.com', role: 'admin' },
  { name: 'เจ้าหน้าที่', email: 'staff@dormitory.com', role: 'staff' },
  { name: 'ผู้เช่า (สมชาย)', email: 'tenant@dormitory.com', role: 'tenant' },
];

async function seed() {
  const hash = await bcrypt.hash(DEV_PASSWORD, 10);

  console.log('========================================');
  console.log('  บัญชีทดสอบ — รหัสผ่าน:', DEV_PASSWORD);
  console.log('========================================');

  // แปลง manager เก่าเป็น staff
  await db.query(
    "UPDATE users SET role = 'staff' WHERE role = 'manager'"
  );

  for (const user of TEST_USERS) {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [
      user.email,
    ]);

    if (existing.length > 0) {
      await db.query(
        'UPDATE users SET name = ?, password = ?, role = ? WHERE email = ?',
        [user.name, hash, user.role, user.email]
      );
      console.log(`  [อัปเดต] ${user.role.padEnd(8)} ${user.email}`);
    } else {
      await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, hash, user.role]
      );
      console.log(`  [สร้าง]   ${user.role.padEnd(8)} ${user.email}`);
    }
  }

  // ผูกบัญชีผู้เช่ากับข้อมูล tenant (อีเมลต้องตรงกัน)
  await db.query(
    `UPDATE tenants SET email = ? WHERE id = 1`,
    ['tenant@dormitory.com']
  );
  console.log('  [ผูก]    tenant@dormitory.com → ผู้เช่า id=1 (ห้อง A101)');

  const [others] = await db.query(
    'SELECT id, email FROM users WHERE email NOT IN (?)',
    [TEST_USERS.map((u) => u.email)]
  );
  for (const row of others) {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, row.id]);
    console.log(`  [รีเซ็ต]  ${row.email}`);
  }

  console.log('========================================');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
