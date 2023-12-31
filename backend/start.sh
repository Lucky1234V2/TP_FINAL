#!/bin/bash
# Démarrer Apache en arrière-plan
apache2-foreground &

# Attendre que MySQL soit opérationnel
sleep 5

# Démarrer le serveur WebSocket
php /var/www/html/websocket/WebSocketServer.php
