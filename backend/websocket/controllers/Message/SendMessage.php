<?php
function sendMessage($db, $data)
{
    if ($data->action === 'message') {
        // Save message in database
        $stmt = $db->getPdo()->prepare("INSERT INTO messages (chatroom_id, user_id, message) VALUES (?, ?, ?)");
        $stmt->execute([$data->chatroom_id, $data->user_id, $data->message]);

        // Recover message ID
        $messageId = $db->getPdo()->lastInsertId();

        // Prepare the response to be sent to customers
        $formattedMessage = [
            'id' => $messageId,
            'chatroom_id' => $data->chatroom_id,
            'user_id' => $data->user_id,
            'message' => $data->message,
            'timestamp' => date('Y-m-d H:i:s')
        ];

        return json_encode($formattedMessage);
    }
}
