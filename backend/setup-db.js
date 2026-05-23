const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create connection without selecting database (to create DB if needed)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection error:', err);
    process.exit(1);
  }

  console.log('✅ Connected to MySQL');

  // Drop and recreate database fresh
  connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`, (err1) => {
    if (err1) {
      console.error('❌ Error dropping database:', err1);
      process.exit(1);
    }

    const createDB = `CREATE DATABASE ${process.env.DB_NAME};`;
    
    connection.query(createDB, (err2) => {
      if (err2) {
        console.error('❌ Error creating database:', err2);
        process.exit(1);
      }

      console.log(`✅ Database '${process.env.DB_NAME}' ready`);

      // Now switch to the database
      const useDB = `USE ${process.env.DB_NAME};`;
      
      connection.query(useDB, (err) => {
        if (err) {
          console.error('❌ Error selecting database:', err);
          process.exit(1);
        }

        // Read schema file
        const schemaPath = path.join(__dirname, 'database-schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema
        connection.query(schemaSql, (err, results) => {
          if (err) {
            console.error('❌ Error executing schema:', err);
            process.exit(1);
          }

          console.log('✅ Database tables created successfully!');
          console.log('📊 Tables created:');
          console.log('   - apartments');
          console.log('   - rooms');
          console.log('   - tenants');
          console.log('   - bills');
          console.log('   - maintenance');
          console.log('   - users');
          console.log('   - utilities');
          console.log('   - contracts');
          console.log('   - meter_readings');
          console.log('   - payments');
          console.log('   - bill_items');

          connection.end(() => {
            console.log('\n✨ Database setup complete! Server is ready to use.');
            process.exit(0);
          });
        });
      });
    });
  });
});
