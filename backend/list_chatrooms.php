<?php
require 'db.php';

$stmt = $pdo->prepare("SELECT * FROM chatrooms");
$stmt->execute();
$chatrooms = $stmt->fetchAll();

echo json_encode($chatrooms);
