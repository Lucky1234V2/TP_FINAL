<?php
require_once 'Database.php';
require_once __DIR__ . '/controllers/Message/SendMessage.php';
require_once __DIR__ . '/controllers/Chatroom/CreateChatroom.php';
require_once __DIR__ . '/controllers/Chatroom/GetChatrooms.php';
require_once __DIR__ . '/controllers/Message/GetMessage.php';
require_once __DIR__ . '/controllers/Chatroom/DeleteChatroom.php';
require_once __DIR__ . '/controllers/Chatroom/UpdateChatroom.php';
class ChatHandler
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function handleMessage($data)
    {
        return sendMessage($this->db, $data);
    }
    public function getChatroomMessages($chatroomId)
    {
        return getChatroomMessages($this->db, $chatroomId);
    }
    public function getChatrooms($userId)
    {
        return getChatrooms($this->db, $userId);
    }
    public function createChatroom($chatroomData, $creatorId)
    {
        return createChatroom($this->db, $chatroomData, $creatorId);
    }
    public function deleteChatroom($chatroomId)
    {
        return deleteChatroom($this->db->getPdo(), $chatroomId);
    }
    public function updateChatroom($chatroomData)
    {
        return updateChatroom($this->db->getPdo(), $chatroomData);
    }
}
