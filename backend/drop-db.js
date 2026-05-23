const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

connection.connect((err) => {
  if (err) throw err;
  connection.query(DROP DATABASE IF EXISTS dormitory_system, (err) => {
    if (err) throw err;
    console.log('Database dropped');
    connection.end();
  });
});
