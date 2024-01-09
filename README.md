# Projet React Native avec Backend PHP

## Technologies Requises
- Docker
- npm
- React
- React Native
- Android Studio

## Lancement du Projet React Native
    cd react-native
    npm install
    react-native start
## Choix de la Plateforme :
Metro offre la possibilité de lancer l'application sur Android ou iOS. Il est recommandé d'utiliser Android.

- Pour lancer sur Android, choisissez 'a - run on Android'.
- Pour recharger l'application, appuyez sur 'r - reload the app'.

## Lancement du Backend
    docker-compose up --build
### Containers Créés :
Trois containers seront créés :

- tp_final-mysql-1
- tp_final-php-1
- tp_final-phpmyadmin-1

### Configuration de la Base de Données :
Le container tp_final-php ne se lancera pas initialement, car il nécessite une base de données.
- Accédez à phpMyAdmin à l'adresse http://localhost:8080/.
- Connectez-vous avec les identifiants suivants :

- Utilisateur :

      root
  
- Mot de passe :

      rootpassword

- Importez la base de données 'tp_final' qui se trouve ici
[bdd tp_final](backend/bdd)
- Après l'ajout de la base de données, exécutez :

      docker-compose restart
