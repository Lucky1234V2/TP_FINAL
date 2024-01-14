<?php
$host = 'mysql';
$db = 'tp_final';
$user = 'root'; // Votre nom d'utilisateur
$pass = 'rootpassword'; // Votre mot de passe
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

function testConnection()
{
    global $dsn, $user, $pass, $options;

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        return 'Connexion réussie à la base de données.';
    } catch (PDOException $e) {
        return 'Erreur de connexion à la base de données : ' . $e->getMessage();
    }
}

// Test de la connexion
echo testConnection();
