const mysql = require('mysql');

const connection = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion_pret",
  timezone: 'UTC'
});

// Test de connexion
connection.getConnection((err, conn) => {
  if (err) {
    console.error('ERREUR MySQL:', {
      code: err.code,
      message: err.sqlMessage
    });
    process.exit(1);
  }
  console.log('✅ Base de données connectée (ID:', conn.threadId + ')');
  conn.release();
});

module.exports = connection;