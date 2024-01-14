FROM php:7.4-apache

# Mise à jour des paquets et installation des dépendances nécessaires
RUN apt-get update && \
    apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git

# Installation des extensions PHP
RUN docker-php-ext-install pdo_mysql zip

# Installation de Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && php -r "unlink('composer-setup.php');"

# Copie des fichiers du projet
COPY . /var/www/html

# Copier le script de démarrage
COPY start.sh /usr/local/bin/start.sh

# Rendre le script de démarrage exécutable
RUN chmod +x /usr/local/bin/start.sh

# Installation des dépendances avec Composer si composer.json existe
RUN if [ -f "composer.json" ]; then /usr/local/bin/composer install; fi

# Exposition du port 80 pour Apache
EXPOSE 80

# Exposition d'un port supplémentaire pour le serveur WebSocket (par exemple, 9000)
EXPOSE 9000

# Définir le script de démarrage comme commande par défaut
CMD ["/usr/local/bin/start.sh"]
