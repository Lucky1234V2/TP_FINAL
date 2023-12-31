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
    public function getChatrooms($userId)
    {
        // Récupérer tous les salons publics
        $stmt = $this->db->getPdo()->prepare("
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
    public function createChatroom($chatroomData, $creatorId)
    {
        // Vérifier si la catégorie existe déjà
        $stmt = $this->db->getPdo()->prepare("SELECT * FROM categorie WHERE categorie = ?");
        $stmt->execute([$chatroomData->categorie]);
        if ($stmt->rowCount() == 0) {
            // La catégorie n'existe pas, donc on l'insère
            $insertCategorie = $this->db->getPdo()->prepare("INSERT INTO categorie (categorie) VALUES (?)");
            $insertCategorie->execute([$chatroomData->categorie]);
        }

        // Insérer le nouveau salon de messagerie dans la base de données avec la catégorie et le statut privé/public
        $stmt = $this->db->getPdo()->prepare("INSERT INTO chatrooms (name, categorie, is_private) VALUES (?, ?, ?)");
        $isPrivate = isset($chatroomData->isPrivate) && $chatroomData->isPrivate ? 1 : 0;
        if ($stmt->execute([$chatroomData->name, $chatroomData->categorie, $isPrivate])) {
            $chatroomId = $this->db->getPdo()->lastInsertId();
            // Ajouter le créateur du salon à la table chatroom_access si le salon est privé
            if ($isPrivate) {
                $accessStmt = $this->db->getPdo()->prepare("INSERT INTO chatroom_access (chatroom_id, user_id) VALUES (?, ?)");
                $accessStmt->execute([$chatroomId, $creatorId]);

                if (isset($chatroomData->invitedUsers) && is_array($chatroomData->invitedUsers)) {
                    foreach ($chatroomData->invitedUsers as $pseudo) {
                        $userId = $this->convertPseudoToUserId($pseudo);
                        echo "Pseudo: $pseudo, ID utilisateur: $userId\n";
                        if ($userId) {
                            $accessStmt->execute([$chatroomId, $userId]);
                        } else {
                            // Arrêter l'exécution et renvoyer un message d'erreur
                            return ["success" => false, "error" => "Aucun utilisateur trouvé pour le pseudo '$pseudo'"];
                        }
                    }
                }
            }

            return ["success" => true, "chatrooms" => $this->getChatrooms($creatorId)];
        } else {
            return ["success" => false, "error" => "Erreur lors de l'insertion du salon de discussion"];
        }
    }

    private function convertPseudoToUserId($pseudo)
    {
        $stmt = $this->db->getPdo()->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$pseudo]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ? $user['id'] : null;
    }
}
