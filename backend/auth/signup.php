<?php
require '../db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->password)) {
    $username = $data->username;
    $password = password_hash($data->password, PASSWORD_DEFAULT);

    // Checks if the username is already in use
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->rowCount() > 0) {
        // User name already in use
        echo json_encode(["success" => false, "error" => "Ce nom d'utilisateur est déjà utilisé"]);
    } else {
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        if ($stmt->execute([$username, $password])) {
            $userId = $pdo->lastInsertId(); // Récupère l'ID de l'utilisateur inséré
            echo json_encode(["success" => true, "user" => ["id" => $userId]]);
        } else {
            echo json_encode(["success" => false, "error" => "Erreur lors de l'inscription"]);
        }
    }
} else {
    echo json_encode(["success" => false, "error" => "Données manquantes"]);
}
