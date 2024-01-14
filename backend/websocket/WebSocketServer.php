<?php
require __DIR__ . '/../vendor/autoload.php';
require 'ChatHandler.php';
require 'controllers/Message/MessageActions.php';
require 'controllers/Chatroom/ChatroomActions.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

class WebSocketServer implements MessageComponentInterface
{
    protected $clients;
    private $chatHandler;
    private $userIds;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->chatHandler = new ChatHandler();
        $this->userIds = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $queryParams = [];
        parse_str(parse_url($conn->httpRequest->getUri(), PHP_URL_QUERY), $queryParams);
        $userId = $queryParams['userId'] ?? null;

        $this->clients->attach($conn);
        $this->userIds[$conn] = $userId; // Store user ID
        echo "Nouvelle connexion! ({$conn->resourceId}), UserID: $userId\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg);
        if ($data->action === 'join') {
            // Retrieve and send previous show messages
            handleJoinAction($this->chatHandler, $data, $from);
        } elseif ($data->action === 'message') {
            handleMessageAction($this->chatHandler, $this->clients, $data);
        } elseif ($data->action === 'get_chatrooms') {
            handleGetChatroomsAction($this->chatHandler, $data, $from);
        } elseif ($data->action === 'create_chatroom') {
            handleCreateChatroomAction($this->chatHandler, $this->userIds, $this->clients, $data, $from);
        } else if ($data->action === 'delete_chatroom') {
            handleDeleteChatroomAction($this->chatHandler, $data, $from);
        } else if ($data->action === 'update_chatroom') {
            handleUpdateChatroomAction($this->chatHandler, $data, $from);
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        echo "Connexion {$conn->resourceId} fermée\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
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
