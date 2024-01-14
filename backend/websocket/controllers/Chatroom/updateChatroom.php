<?php
function updateChatroom($pdo, $chatroomData)
{
    // Logique pour mettre à jour un chatroom
    // Exemple :
    $stmt = $pdo->prepare("UPDATE chatrooms,categorie SET chatrooms.name = ?, categorie.categorie = ? WHERE chatrooms.id = ?;");
    $success = $stmt->execute([$chatroomData['newName'], $chatroomData['newCategorie'], $chatroomData['chatroomId']]);

    return ["success" => $success];
}
