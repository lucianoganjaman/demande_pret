// Importation du module mysql pour la connexion à la base de données
const mysql = require('mysql');

// Création d'un pool de connexions pour gérer plusieurs connexions simultanées
const connection = mysql.createPool({
  connectionLimit: 10, // Limite de connexions simultanées
  host: "localhost", // Hôte de la base de données
  user: "root", // Nom d'utilisateur MySQL
  password: "", // Mot de passe MySQL (vide dans cet exemple)
  database: "gestion_pret", // Nom de la base de données
  timezone: 'UTC' // Fuseau horaire pour les dates
});

// Test de connexion à la base de données
connection.getConnection((err, conn) => {
  if (err) {
    console.error('ERREUR MySQL:', {
      code: err.code,
      message: err.sqlMessage
    });
    process.exit(1); // Arrête le processus en cas d'erreur
  }
  console.log('✅ Base de données connectée (ID:', conn.threadId + ')');
  conn.release(); // Libère la connexion après le test
});

// Exportation du pool de connexions pour utilisation dans d'autres fichiers
module.exports = connection;