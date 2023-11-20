<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->chatroom_id) && isset($data->user_id) && isset($data->message)){
    $chatroom_id = $data->chatroom_id;
    $user_id = $data->user_id;
    $message = $data->message;

    $stmt = $pdo->prepare("INSERT INTO messages (chatroom_id, user_id, message) VALUES (?, ?, ?)");
    if($stmt->execute([$chatroom_id, $user_id, $message])){
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}