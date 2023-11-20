<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->chatroom_id)){
    $chatroom_id = $data->chatroom_id;

    $stmt = $pdo->prepare("SELECT * FROM messages WHERE chatroom_id = ? ORDER BY timestamp DESC");
    $stmt->execute([$chatroom_id]);
    $messages = $stmt->fetchAll();

    echo json_encode($messages);
}
