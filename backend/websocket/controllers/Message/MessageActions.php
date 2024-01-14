<?php
function handleJoinAction($chatHandler, $data, $from)
{
    // Retrieve and send previous show messages
    $chatroomMessages = $chatHandler->getChatroomMessages($data->chatroomId);
    $from->send(json_encode($chatroomMessages));
}

function handleMessageAction($chatHandler, $clients, $data)
{
    // Manage the message and send the reply to all customers
    $response = $chatHandler->handleMessage($data);
    foreach ($clients as $client) {
        $client->send($response);
    }
}
