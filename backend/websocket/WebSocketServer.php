<?php
require __DIR__ . '/../vendor/autoload.php';
require 'ChatHandler.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

class WebSocketServer implements MessageComponentInterface
{
    protected $clients;
    private $chatHandler;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->chatHandler = new ChatHandler();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "Nouvelle connexion! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg);
        if ($data->action === 'join') {
            // Récupérer et envoyer les messages précédents du salon
            $chatroomMessages = $this->chatHandler->getChatroomMessages($data->chatroomId);
            $from->send(json_encode($chatroomMessages));
        } elseif ($data->action === 'message') {
            $response = $this->chatHandler->handleMessage($data);
            foreach ($this->clients as $client) {
                $client->send($response);
            }
        } elseif ($data->action === 'get_chatrooms') {
            $chatrooms = $this->chatHandler->getChatrooms();
            $from->send(json_encode(['action' => 'update_chatrooms', 'chatrooms' => $chatrooms]));
        } elseif ($data->action === 'create_chatroom') {
            $this->chatHandler->createChatroom($data);
            $chatrooms = $this->chatHandler->getChatrooms();
            foreach ($this->clients as $client) {
                $client->send(json_encode(['action' => 'update_chatrooms', 'chatrooms' => $chatrooms]));
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        echo "Connexion {$conn->resourceId} fermée\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "Une erreur est survenue: {$e->getMessage()}\n";
        $conn->close();
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new WebSocketServer()
        )
    ),
    9000
);

$server->run();
