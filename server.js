// Importation des modules nécessaires
const express = require('express');
const path = require('path');
const db = require('./connexion');

// Initialisation de l'application Express
const app = express();

// Middleware pour parser les données des formulaires et JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration du moteur de rendu EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de journalisation des requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route pour la page d'accueil (formulaire de nouvelle demande)
app.get('/', (req, res) => {
  res.render('clientform', { title: 'Nouvelle demande', success: false, error: null });

});

// Route pour afficher la liste des détails des demandes
app.get('/details', (req, res) => {
  db.query('SELECT * FROM demandes_credit ORDER BY datedemcredcas DESC', (err, results) => {
    if (err) {
      console.error('Erreur DB:', err);
      return res.status(500).render('error', {
        title: 'Erreur',
        message: 'Impossible de charger les demandes'
      });
    }
    res.render('clientliste', { // Changement de 'detais' à 'clientliste' pour cohérence
      title: 'Liste des détails',
      demandes: results
    });
  });
});

// Route pour la page "À propos"
app.get('/apropos', (req, res) => {
  res.render('apropos', { title: 'À propos' });
});

// Route pour la soumission du formulaire
app.post('/submit', (req, res) => {
  const requiredFields = [
    'nomcli', 'prenomcli', 'montantdemcredcli', 'matriculeportcas',
    'prenomportcas', 'adressecli', 'contactcli', 'activitecli',
    'maturiteactivitecli', 'nomcaution', 'prenomcaution',
    'cincaution', 'contactcaution', 'sexecli', 'matrimonialecli'
  ];

  // Vérification des champs obligatoires
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).render('clientform', {
      title: 'Nouvelle demande',
      success: false,
      error: `Champs obligatoires manquants : ${missingFields.join(', ')}`
    });
  }

  // Validation des champs numériques
  if (isNaN(req.body.montantdemcredcli) || req.body.montantdemcredcli <= 0) {
    return res.status(400).render('clientform', {
      title: 'Nouvelle demande',
      success: false,
      error: 'Le montant du crédit doit être un nombre positif'
    });
  }

  if (isNaN(req.body.capacitecli) || req.body.capacitecli <= 0) {
    return res.status(400).render('clientform', {
      title: 'Nouvelle demande',
      success: false,
      error: 'La capacité de remboursement doit être un nombre positif'
    });
  }

  // Préparation des données du formulaire
  const formData = {
    datedemcredcas: req.body.datedemcredcas || new Date(),
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
    montantdemcredcli: parseFloat(req.body.montantdemcredcli),
    moiscli: req.body.moiscli,
    capacitecli: parseFloat(req.body.capacitecli),
    nomcaution: req.body.nomcaution,
    prenomcaution: req.body.prenomcaution,
    cincaution: req.body.cincaution,
    contactcaution: req.body.contactcaution,
    decisiondemcredcas: req.body.decisiondemcredcas || 'En attente',
    statut: 'Nouvelle',
    date_creation: new Date(), // Ajout pour satisfaire la contrainte NOT NULL
    date_modification: new Date() // Ajout pour satisfaire la contrainte NOT NULL
  };

  // Insertion dans la base de données
  db.query('INSERT INTO demandes_credit SET ?', formData, (err, result) => {
    if (err) {
      console.error('Erreur DB:', err);
      return res.status(500).render('clientform', {
        title: 'Nouvelle demande',
        success: false,
        error: 'Échec de l\'enregistrement dans la base de données'
      });
    }
    res.redirect('/?success=true');
  });
});

// Route pour afficher la liste des demandes
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

// Route pour afficher les détails d'une demande spécifique
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

// Route pour afficher le formulaire de modification
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

// Route pour mettre à jour une demande
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
    montantdemcredcli: parseFloat(req.body.montantdemcredcli),
    moiscli: req.body.moiscli,
    capacitecli: parseFloat(req.body.capacitecli),
    nomcaution: req.body.nomcaution,
    prenomcaution: req.body.prenomcaution,
    cincaution: req.body.cincaution,
    contactcaution: req.body.contactcaution,
    decisiondemcredcas: req.body.decisiondemcredcas || 'En attente',
    statut: 'Modifié',
    date_modification: new Date() // Mise à jour de la date de modification
  };

  // Mise à jour dans la base de données
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

// Route pour supprimer une demande
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

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Page introuvable',
    message: 'La page que vous cherchez est introuvable.'
  });
});

// Gestion des erreurs serveur
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