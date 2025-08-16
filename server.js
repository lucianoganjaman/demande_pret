const express = require('express');
const path = require('path');
const db = require('./connexion');
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('clientform', { 
    title: 'Nouvelle demande de crédit',
    success: req.query.success
  });
});

app.get('/apropos', (req, res) => {
  res.render('apropos', {
    title: 'À propos'
  });
});

app.post('/submit-credit', (req, res) => {
  // Validation des données requises
  if (!req.body.nomcli || !req.body.prenomcli || !req.body.montantdemcredcli) {
    return res.status(400).render('error', {
      title: 'Erreur',
      message: 'Les champs nom, prénom et montant sont obligatoires'
    });
  }

  // Mapping des données
  const formData = {
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
    statut: 'Nouvelle',
    date_creation: new Date(),
    date_modification: new Date()
  };

  db.query('INSERT INTO demandes_credit SET ?', formData, (err, result) => {
    if (err) {
      console.error('Erreur DB:', err);
      return res.status(500).render('error', {
        title: 'Erreur',
        message: 'Échec de l\'enregistrement dans la base de données'
      });
    }
    
    res.redirect('/?success=true');
  });
});

app.get('/liste', (req, res) => {
  db.query('SELECT id, datedemcredcas, matriculeportcas, prenomportcas, typecas, nomcli, prenomcli, montantdemcredcli, decisiondemcredcas FROM demandes_credit ORDER BY datedemcredcas DESC', (err, results) => {
    if (err) {
      console.error('Erreur DB:', err);
      return res.status(500).render('error', {
        title: 'Erreur',
        message: 'Impossible de charger les demandes'
      });
    }
    
    res.render('clientliste', {
      title: 'Liste des demandes de crédit',
      demandes: results
    });
  });
});

app.get('/demande/:id', (req, res) => {
  const demandeId = req.params.id;
  
  db.query('SELECT * FROM demandes_credit WHERE id = ?', [demandeId], (err, results) => {
    if (err || results.length === 0) {
      console.error('Erreur DB:', err);
      return res.status(404).render('error', {
        title: 'Non trouvé',
        message: 'Demande introuvable'
      });
    }
    
    res.render('detail', {
      title: 'Détails de la demande',
      demande: results[0]
    });
  });
});

app.get('/modifier/:id', (req, res) => {
  const demandeId = req.params.id;
  
  db.query('SELECT * FROM demandes_credit WHERE id = ?', [demandeId], (err, results) => {
    if (err || results.length === 0) {
      console.error('Erreur DB:', err);
      return res.status(404).render('error', {
        title: 'Non trouvé',
        message: 'Demande introuvable'
      });
    }
    
    res.render('modifier', {
      title: 'Modifier demande de crédit',
      demande: results[0]
    });
  });
});

app.post('/modifier/:id', (req, res) => {
  const demandeId = req.params.id;
  
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
    statut: 'Traité',
    date_modification: new Date()
  };

  db.query('UPDATE demandes_credit SET ? WHERE id = ?', [updateData, demandeId], (err, result) => {
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

app.get('/supprimer/:id', (req, res) => {
  const demandeId = req.params.id;
  
  db.query('DELETE FROM demandes_credit WHERE id = ?', [demandeId], (err, result) => {
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

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Non trouvé',
    message: 'Page introuvable'
  });
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).render('error', {
    title: 'Erreur',
    message: 'Une erreur interne est survenue'
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
});