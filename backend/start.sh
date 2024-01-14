# Start Apache in the background
apache2-foreground &

# Wait until MySQL is up and running
sleep 5

# Start the WebSocket server
php /var/www/html/websocket/WebSocketServer.php
