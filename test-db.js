const Database = require('better-sqlite3');

// Connexion à la base de données
const db = new Database('./database.db');

// Afficher les projets
console.log('Projets dans la base de données:');
console.log(db.prepare('SELECT * FROM projets').all());

// Afficher les messages
console.log('\nMessages dans la base de données:');
console.log(db.prepare('SELECT * FROM messages').all());

// Fermer la connexion
setTimeout(() => {
    db.close();
}, 1000);
