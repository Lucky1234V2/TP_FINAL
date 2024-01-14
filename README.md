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
### Modification
Veuillez mettre l'ip de votre pc dans :
- [login/http://192.168.1.127:8000/auth/login.php](https://github.com/Lucky1234V2/tp_final/blob/0ecf2227b7b9865d10dba248f925c1adfb97a4c1/react-native/screens/LoginScreen.tsx#L22C15-L22C15)
- [signup/http://192.168.1.127:8000/auth/signup.php](https://github.com/Lucky1234V2/tp_final/blob/0ecf2227b7b9865d10dba248f925c1adfb97a4c1/react-native/screens/LoginScreen.tsx#L42)
- [CreateChatroomScreen/ws://192.168.1.127:9000?userId=${userId}](https://github.com/Lucky1234V2/tp_final/blob/0ecf2227b7b9865d10dba248f925c1adfb97a4c1/react-native/screens/CreateChatroomScreen.tsx#L13)
- [MessageListScreen/ws://192.168.1.127:9000?userId=${userId}](https://github.com/Lucky1234V2/tp_final/blob/0ecf2227b7b9865d10dba248f925c1adfb97a4c1/react-native/screens/MessageListScreen.tsx#L66)
- [ChatroomSettingsScreen/ws://192.168.1.127:9000?userId=${userId}](https://github.com/Lucky1234V2/tp_final/blob/0ecf2227b7b9865d10dba248f925c1adfb97a4c1/react-native/screens/ChatroomSettingsScreen.tsx#L23)
- [ChatroomScreen/ws://192.168.1.127:9000](https://github.com/Lucky1234V2/tp_final/blob/0ecf2227b7b9865d10dba248f925c1adfb97a4c1/react-native/screens/ChatroomScreen.tsx#L48)
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
- Accédez à phpMyAdmin à l'adresse http://localhost:8080/.
- Connectez-vous avec les identifiants suivants :

- Utilisateur :

      root
  
- Mot de passe :

      rootpassword

- Importez si besoin la base de données 'tp_final' qui se trouve ici
[bdd tp_final](backend/bdd)
- Après l'ajout de la base de données, exécutez :

      docker-compose restart
