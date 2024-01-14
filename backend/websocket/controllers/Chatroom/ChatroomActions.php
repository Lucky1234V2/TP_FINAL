<?php
function handleGetChatroomsAction($chatHandler, $data, $from)
{
    $userId = $data->userId;
    $chatrooms = $chatHandler->getChatrooms($userId);
    $from->send(json_encode(['action' => 'update_chatrooms', 'chatrooms' => $chatrooms]));
}

function handleCreateChatroomAction($chatHandler, $userIds, $clients, $data, $from)
{
    $creatorId = $userIds[$from] ?? null;
    $response = $chatHandler->createChatroom($data, $creatorId);

    if ($response["success"]) {
        foreach ($clients as $client) {
            $userId = $userIds[$client] ?? null;
            $chatrooms = $chatHandler->getChatrooms($userId);
            $client->send(json_encode(['action' => 'update_chatrooms', 'chatrooms' => $chatrooms]));
        }
    } else {
        $from->send(json_encode(['action' => 'create_chatroom_failed', 'error' => $response["error"]]));
    }
}

function handleDeleteChatroomAction($chatHandler, $data, $from)
{
    $chatroomId = $data->chatroomId;
    $response = $chatHandler->deleteChatroom($chatroomId);

    $from->send(json_encode($response));
}

function handleUpdateChatroomAction($chatHandler, $data, $from)
{
    $chatroomData = [
        'chatroomId' => $data->chatroomId,
        'newName' => $data->newName,
        'newCategorie' => $data->newCategorie
    ];
    $response = $chatHandler->updateChatroom($chatroomData);

    $from->send(json_encode($response));
}
