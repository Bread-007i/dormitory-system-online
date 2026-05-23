require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function migrate() {
  const sql = fs.readFileSync(
    path.join(__dirname, '../database-payment-requests.sql'),
    'utf8'
  );
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('--') && s !== 'USE dormitory_system');

  for (const stmt of statements) {
    await db.query(stmt);
  }
  console.log('✅ payment_requests table ready');
  process.exit(0);
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
