<?php
require_once 'Database.php';
class ChatHandler
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function handleMessage($data)
    {
        if ($data->action === 'message') {
            // Enregistrer le message dans la base de données
            $stmt = $this->db->getPdo()->prepare("INSERT INTO messages (chatroom_id, user_id, message) VALUES (?, ?, ?)");
            $stmt->execute([$data->chatroom_id, $data->user_id, $data->message]);

            // Récupérer l'ID du message inséré
            $messageId = $this->db->getPdo()->lastInsertId();

            // Préparer la réponse à envoyer aux clients
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
    public function getChatroomMessages($chatroomId)
    {
        $stmt = $this->db->getPdo()->prepare("SELECT * FROM messages WHERE chatroom_id = ?");
        $stmt->execute([$chatroomId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getChatrooms()
    {
        $stmt = $this->db->getPdo()->prepare("SELECT * FROM chatrooms");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function createChatroom($chatroomData)
    {
        // Insérer le nouveau salon de messagerie dans la base de données
        $stmt = $this->db->getPdo()->prepare("INSERT INTO chatrooms (name) VALUES (?)");
        $stmt->execute([$chatroomData->name]);

        // Récupérer et retourner la liste mise à jour des salons de messagerie
        return $this->getChatrooms();
    }
}
