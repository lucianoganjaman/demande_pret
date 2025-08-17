-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 17 août 2025 à 05:21
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_pret`
--

-- --------------------------------------------------------

--
-- Structure de la table `demandes_credit`
--

CREATE TABLE `demandes_credit` (
  `id` int(11) NOT NULL,
  `datedemcredcas` date NOT NULL,
  `matriculeportcas` varchar(50) NOT NULL,
  `prenomportcas` varchar(100) NOT NULL,
  `typecas` varchar(50) NOT NULL,
  `sourcecas` varchar(50) NOT NULL,
  `porteurcas` varchar(50) NOT NULL,
  `nomcli` varchar(100) NOT NULL,
  `prenomcli` varchar(100) NOT NULL,
  `cincli` varchar(20) DEFAULT NULL,
  `datenaisscli` date DEFAULT NULL,
  `sexecli` varchar(10) DEFAULT NULL,
  `matrimonialecli` varchar(20) DEFAULT NULL,
  `adressecli` varchar(200) NOT NULL,
  `contactcli` varchar(50) NOT NULL,
  `activitecli` varchar(100) NOT NULL,
  `maturiteactivitecli` varchar(10) NOT NULL,
  `montantdemcredcli` decimal(15,2) NOT NULL,
  `moiscli` varchar(10) NOT NULL,
  `capacitecli` decimal(15,2) NOT NULL,
  `nomcaution` varchar(100) NOT NULL,
  `prenomcaution` varchar(100) NOT NULL,
  `cincaution` varchar(20) NOT NULL,
  `contactcaution` varchar(50) NOT NULL,
  `decisiondemcredcas` varchar(50) DEFAULT 'En attente',
  `statut` varchar(50) DEFAULT 'Nouvelle',
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `demandes_credit`
--
ALTER TABLE `demandes_credit`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `demandes_credit`
--
ALTER TABLE `demandes_credit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
