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
        // Vérifier si la catégorie existe déjà
        $stmt = $this->db->getPdo()->prepare("SELECT * FROM categorie WHERE categorie = ?");
        $stmt->execute([$chatroomData->categorie]);
        if ($stmt->rowCount() == 0) {
            // La catégorie n'existe pas, donc on l'insère
            $insertCategorie = $this->db->getPdo()->prepare("INSERT INTO categorie (categorie) VALUES (?)");
            $insertCategorie->execute([$chatroomData->categorie]);
        }

        // Insérer le nouveau salon de messagerie dans la base de données avec la catégorie
        $stmt = $this->db->getPdo()->prepare("INSERT INTO chatrooms (name, categorie) VALUES (?, ?)");
        if ($stmt->execute([$chatroomData->name, $chatroomData->categorie])) {
            return ["success" => true, "chatrooms" => $this->getChatrooms()];
        } else {
            return ["success" => false, "error" => "Erreur lors de l'insertion du salon de discussion"];
        }
    }
}
