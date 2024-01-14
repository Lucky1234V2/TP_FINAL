<?php
function deleteChatroom($pdo, $chatroomId)
{
    // Logique pour supprimer un chatroom
    // Exemple :
    $stmt = $pdo->prepare("DELETE FROM chatrooms WHERE id = ?");
    $success = $stmt->execute([$chatroomId]);

    return ["success" => $success];
}
