<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->name)){
    $name = $data->name;

    $stmt = $pdo->prepare("INSERT INTO chatrooms (name) VALUES (?)");
    if($stmt->execute([$name])){
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}
