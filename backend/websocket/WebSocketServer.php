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
        $this->userIds[$conn] = $userId; // Stocker l'ID de l'utilisateur
        echo "Nouvelle connexion! ({$conn->resourceId}), UserID: $userId\n";
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
            $userId = $data->userId; // ou une autre propriété appropriée
            $chatrooms = $this->chatHandler->getChatrooms($userId);
            $from->send(json_encode(['action' => 'update_chatrooms', 'chatrooms' => $chatrooms]));
        } elseif ($data->action === 'create_chatroom') {
            // Assurez-vous que l'ID du créateur est bien passé dans les données
            $creatorId = $this->userIds[$from] ?? null;
            // Appeler createChatroom avec les données et l'ID du créateur
            $response = $this->chatHandler->createChatroom($data, $creatorId);

            // Vérifier si la création a réussi avant d'envoyer la mise à jour
            if ($response["success"]) {
                // Envoyer la mise à jour à tous les clients connectés
                foreach ($this->clients as $client) {
                    // Pour chaque client, obtenir les salons de discussion accessibles
                    $userId = $this->userIds[$client] ?? null;
                    $chatrooms = $this->chatHandler->getChatrooms($userId);
                    $client->send(json_encode(['action' => 'update_chatrooms', 'chatrooms' => $chatrooms]));
                }
            } else {
                // En cas d'échec, envoyer une réponse d'erreur au client qui a initié la demande
                $from->send(json_encode(['action' => 'create_chatroom_failed', 'error' => $response["error"]]));
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
