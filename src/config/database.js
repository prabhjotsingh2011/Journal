// const  = require("mysql");
const mysql=require('mysql')
const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12626645',
  password: 'CV5Zgkjt14',
  database: 'sql12626645',
  connectionLimit: 10
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});


module.exports = db;
