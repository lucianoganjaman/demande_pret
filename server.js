const express = require('express');
const path = require('path');
const db = require('./connexion');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('clientform', {
    title: 'Nouvelle demande',
    success: req.query.success
  });
});

app.get('/apropos', (req, res) => {
  res.render('apropos', { title: 'À propos' });
});

// Soumission du formulaire
app.post('/submit-credit', (req, res) => {
  const requiredFields = [
    'nomcli', 'prenomcli', 'montantdemcredcli', 'matriculeportcas', 
    'prenomportcas', 'adressecli', 'contactcli', 'activitecli', 
    'maturiteactivitecli', 'nomcaution', 'prenomcaution', 
    'cincaution', 'contactcaution', 'sexecli', 'matrimonialecli'
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).render('error', {
      title: 'Erreur',
      message: `Champs obligatoires manquants : ${missingFields.join(', ')}`
    });
  }

  const formData = {
    datedemcredcas: req.body.datedemcred || new Date(),
    matriculeportcas: req.body.matriculeportcas,
    prenomportcas: req.body.prenomportcas,
    typecas: req.body.typecas || 'Nouveau cas',
    sourcecas: req.body.sourcecas || 'PORTE A PORTE',
    porteurcas: req.body.porteurcas || 'BTW',
    nomcli: req.body.nomcli,
    prenomcli: req.body.prenomcli,
    cincli: req.body.cincli || null,
    datenaisscli: req.body.datenaisscli || null,
    sexecli: req.body.sexecli,
    matrimonialecli: req.body.matrimonialecli,
    adressecli: req.body.adressecli,
    contactcli: req.body.contactcli,
    activitecli: req.body.activitecli,
    maturiteactivitecli: req.body.maturiteactivitecli,
    montantdemcredcli: req.body.montantdemcredcli,
    moiscli: req.body.moiscli,
    capacitecli: req.body.capacitecli,
    nomcaution: req.body.nomcaution,
    prenomcaution: req.body.prenomcaution,
    cincaution: req.body.cincaution,
    contactcaution: req.body.contactcaution,
    decisiondemcredcas: req.body.decisiondemcredcas || 'En attente',
    statut: 'Nouvelle'
  };

  db.query('INSERT INTO demandes_credit SET ?', formData, (err, result) => {
    if (err) {
      console.error('Erreur DB:', err);
      return res.status(500).render('error', {
        title: 'Erreur serveur',
        message: 'Échec de l\'enregistrement'
      });
    }
    res.redirect('/?success=true');
  });
});

// Liste des demandes
app.get('/liste', (req, res) => {
  db.query('SELECT * FROM demandes_credit ORDER BY datedemcredcas DESC', (err, results) => {
    if (err) {
      console.error('Erreur DB:', err);
      return res.status(500).render('error', {
        title: 'Erreur',
        message: 'Impossible de charger les demandes'
      });
    }
    res.render('clientliste', {
      title: 'Liste des demandes',
      demandes: results
    });
  });
});

// Détails d'une demande
app.get('/details/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM demandes_credit WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).render('error', {
        title: 'Non trouvé',
        message: 'Demande introuvable'
      });
    }
    res.render('details', {
      title: 'Détails de la demande',
      demande: results[0]
    });
  });
});

// Modification
app.get('/modifier/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM demandes_credit WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).render('error', {
        title: 'Non trouvé',
        message: 'Demande introuvable'
      });
    }
    res.render('modifier', {
      title: 'Modifier la demande',
      demande: results[0]
    });
  });
});

app.post('/modifier/:id', (req, res) => {
  const id = req.params.id;
  const updateData = {
    datedemcredcas: req.body.datedemcred || new Date(),
    matriculeportcas: req.body.matriculeportcas,
    prenomportcas: req.body.prenomportcas,
    typecas: req.body.typecas,
    sourcecas: req.body.sourcecas,
    porteurcas: req.body.porteurcas,
    nomcli: req.body.nomcli,
    prenomcli: req.body.prenomcli,
    cincli: req.body.cincli || null,
    datenaisscli: req.body.datenaisscli || null,
    sexecli: req.body.sexecli,
    matrimonialecli: req.body.matrimonialecli,
    adressecli: req.body.adressecli,
    contactcli: req.body.contactcli,
    activitecli: req.body.activitecli,
    maturiteactivitecli: req.body.maturiteactivitecli,
    montantdemcredcli: req.body.montantdemcredcli,
    moiscli: req.body.moiscli,
    capacitecli: req.body.capacitecli,
    nomcaution: req.body.nomcaution,
    prenomcaution: req.body.prenomcaution,
    cincaution: req.body.cincaution,
    contactcaution: req.body.contactcaution,
    decisiondemcredcas: req.body.decisiondemcredcas || 'En attente',
    statut: 'Modifié'
  };

  db.query('UPDATE demandes_credit SET ? WHERE id = ?', [updateData, id], (err, result) => {
    if (err) {
      console.error('Erreur DB:', err);
      return res.status(500).render('error', {
        title: 'Erreur',
        message: 'Échec de la mise à jour'
      });
    }
    res.redirect('/liste');
  });
});

// Suppression
app.get('/supprimer/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM demandes_credit WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erreur DB:', err);
      return res.status(500).render('error', {
        title: 'Erreur',
        message: 'Échec de la suppression'
      });
    }
    res.redirect('/liste');
  });
});

// Gestion des erreurs
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Page introuvable',
    message: 'La page que vous cherchez est introuvable.'
  });
});

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).render('error', {
    title: 'Erreur serveur',
    message: 'Une erreur interne est survenue.'
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});