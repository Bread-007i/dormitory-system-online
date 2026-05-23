const db = require('./config/db');

async function testDB() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');

    console.log('==========================');
    console.log('✅ DATABASE CONNECTED');
    console.log('Result:', rows);
    console.log('==========================');

  } catch (err) {
    console.log('==========================');
    console.log('❌ DATABASE ERROR');
    console.log(err.message);
    console.log('==========================');
  }
}

testDB();