const mysql = require('mysql');
const mysqlconnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'garantia',
  port: 3306
});

mysqlconnection.connect(err => {
  if (err) {
    console.log('error en db:', err);
    return;
  } else {
    console.log('database ok');
  }
});

module.exports = mysqlconnection;