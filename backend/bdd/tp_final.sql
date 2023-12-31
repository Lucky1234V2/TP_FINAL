-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : dim. 31 déc. 2023 à 04:08
-- Version du serveur : 5.7.44
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tp_final`
--

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `categorie` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`categorie`) VALUES
('autre'),
('blabla'),
('discussions'),
('jeux'),
('Non catégorisé');

-- --------------------------------------------------------

--
-- Structure de la table `chatrooms`
--

CREATE TABLE `chatrooms` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `categorie` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT 'Non catégorisé'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `chatrooms`
--

INSERT INTO `chatrooms` (`id`, `name`, `categorie`) VALUES
(24, 'gta6', 'jeux'),
(25, 'ici on parle !', 'blabla');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) UNSIGNED NOT NULL,
  `chatroom_id` int(11) UNSIGNED DEFAULT NULL,
  `user_id` int(11) UNSIGNED DEFAULT NULL,
  `message` text,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `chatroom_id`, `user_id`, `message`, `timestamp`) VALUES
(6, 25, 12, 'salut', '2023-12-31 04:07:05');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(2, 'soso', '$2y$10$vkZyarTlZ.57E9fprLeAw.ZmmVmrgFDmCr.pLkv2bo/gwSdufAAIm'),
(3, 'jj', '$2y$10$IpYFPriOYFyFBQeTZHE7JOMkKFbq0/88rmHWI5F8oS9w1OGHLbthy'),
(6, 'test', '$2y$10$k8pZHRmFsj912zh7dzINMe3Ua5NKMFQDVjyp2r8dOmFfjwhdNVsxu'),
(8, 'a', '$2y$10$x741zzWVLTAsrbQVj1ud4u3dcLNcv8hR/miXc5Ty.ikra4YsOiMUC'),
(9, 'dd', '$2y$10$IU98Dxy3BDM24n60jV8Slunu2MwfKME8onQ4BEhPLF2V.6VFirqqm'),
(10, 'rr', '$2y$10$omP5oPbwlat0Tccqqplpe.FACRVAf8kGvbPT13j0ZdChZVCo2WUIK'),
(11, 'ii', '$2y$10$uLeWmU2Q5a3uD6yg/pFhUuf7hik6fQzG54NKM27Y0JaXNhxp3kjbK'),
(12, 't', '$2y$10$riM.PYu4/nI.N3WvvaSZQ.YkRPWDwxS5GS/1Zvq3mxC6oGmf689Fe'),
(13, 'r', '$2y$10$vvrGB4EGHHwjiqghNKzBE.mD1sQzRWh3B0eVUFRvgirJjkXxKma3G');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`categorie`);

--
-- Index pour la table `chatrooms`
--
ALTER TABLE `chatrooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categorie` (`categorie`),
  ADD KEY `categorie_2` (`categorie`),
  ADD KEY `categorie_3` (`categorie`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chatroom_id` (`chatroom_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `chatrooms`
--
ALTER TABLE `chatrooms`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `chatrooms`
--
ALTER TABLE `chatrooms`
  ADD CONSTRAINT `chatrooms_ibfk_1` FOREIGN KEY (`categorie`) REFERENCES `categorie` (`categorie`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`chatroom_id`) REFERENCES `chatrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
