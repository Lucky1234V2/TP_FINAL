<?php
function createChatroom($db, $chatroomData, $creatorId)
{
    // Check if the category already exists
    $stmt = $db->getPdo()->prepare("SELECT * FROM categorie WHERE categorie = ?");
    $stmt->execute([$chatroomData->categorie]);
    if ($stmt->rowCount() == 0) {
        // The category doesn't exist, so we insert it
        $insertCategorie = $db->getPdo()->prepare("INSERT INTO categorie (categorie) VALUES (?)");
        $insertCategorie->execute([$chatroomData->categorie]);
    }

    // Insert new mailroom in bdd
    $stmt = $db->getPdo()->prepare("INSERT INTO chatrooms (name, categorie, is_private) VALUES (?, ?, ?)");
    $isPrivate = isset($chatroomData->isPrivate) && $chatroomData->isPrivate ? 1 : 0;
    if ($stmt->execute([$chatroomData->name, $chatroomData->categorie, $isPrivate])) {
        $chatroomId = $db->getPdo()->lastInsertId();
        // Add the salon creator to the chatroom_access table if the salon is private
        if ($isPrivate) {
            $accessStmt = $db->getPdo()->prepare("INSERT INTO chatroom_access (chatroom_id, user_id) VALUES (?, ?)");
            $accessStmt->execute([$chatroomId, $creatorId]);

            if (isset($chatroomData->invitedUsers) && is_array($chatroomData->invitedUsers)) {
                foreach ($chatroomData->invitedUsers as $pseudo) {
                    $userId = convertPseudoToUserId($db, $pseudo);
                    if ($userId) {
                        $accessStmt->execute([$chatroomId, $userId]);
                    } else {
                        return ["success" => false, "error" => "Aucun utilisateur trouvé pour le pseudo '$pseudo'"];
                    }
                }
            }
        }

        return ["success" => true, "chatrooms" => getChatrooms($db, $creatorId)];
    } else {
        return ["success" => false, "error" => "Erreur lors de l'insertion du salon de discussion"];
    }
}

function convertPseudoToUserId($db, $pseudo)
{
    $stmt = $db->getPdo()->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$pseudo]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    return $user ? $user['id'] : null;
}
