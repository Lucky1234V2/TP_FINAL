<?php
function getChatroomMessages($db, $chatroomId)
{
    $stmt = $db->getPdo()->prepare("SELECT * FROM messages WHERE chatroom_id = ?");
    $stmt->execute([$chatroomId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
