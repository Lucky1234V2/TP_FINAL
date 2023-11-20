<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->password)){
    $username = $data->username;
    $password = password_hash($data->password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    if($stmt->execute([$username, $password])){
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}
