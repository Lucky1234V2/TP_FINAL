#!/bin/bash

# Start Apache in the background
apache2-foreground &

# Start the WebSocket server
php /var/www/html/websocket/WebSocketServer.php
