<?php
function getChatrooms($db, $userId)
{
    // Recover all public lounges
    $stmt = $db->getPdo()->prepare("
    SELECT * FROM chatrooms
    WHERE is_private = 0
    UNION
    SELECT chatrooms.* FROM chatrooms
    JOIN chatroom_access ON chatrooms.id = chatroom_access.chatroom_id
    WHERE chatroom_access.user_id = ?
    ");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
