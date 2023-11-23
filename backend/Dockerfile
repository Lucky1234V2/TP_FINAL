FROM php:7.4-apache

# Installation de l'extension PDO MySQL
RUN docker-php-ext-install pdo_mysql

COPY . /var/www/html
EXPOSE 80
