const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const JWT_SECRET = 'votre_portfolio_secret_2025';
const ADMIN_EMAIL = 'idrisskyavuyirwe@gmail.com';
const ADMIN_PASSWORD = 'admin123'; // Vous devrez changer ce mot de passe

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login.html');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/login.html');
        req.user = user;
        next();
    });
};

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/assets/image', express.static(path.join(__dirname, 'assets', 'image')));

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à la base de données SQLite établie');
    initializeDatabase();
  }
});

// Initialisation de la base de données
function initializeDatabase() {
  db.serialize(() => {
    // Table Projets
    db.run(`CREATE TABLE IF NOT EXISTS projets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      description TEXT,
      technologies TEXT,
      image_url TEXT,
      lien_github TEXT,
      lien_demo TEXT
    )`);

    // Table Messages
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

// Route de connexion
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 heure
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
});

// Route de déconnexion
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

// Protection de la page private.html
app.get('/private.html', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'private.html'));
});

// Routes API
app.get('/api/projets', (req, res) => {
  db.all('SELECT * FROM projets', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/messages', (req, res) => {
  const { nom, email, message } = req.body;
  db.run(
    'INSERT INTO messages (nom, email, message) VALUES (?, ?, ?)',
    [nom, email, message],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
