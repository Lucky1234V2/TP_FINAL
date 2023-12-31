// screens/CreateChatroomScreen.js

import React, {useContext, useState} from 'react';
import {Button, StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import UserContext from '../UserContext';
import useWebSocket from './useWebSocket'; // Assurez-vous que le chemin est correct
const CreateChatroomScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [categorie, setCategorie] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState('');
  const {userId} = useContext(UserContext);
  const {isConnected, sendMessage} = useWebSocket(
    `ws://192.168.1.127:9000?userId=${userId}`,
  );

  const handleCreate = () => {
    if (isConnected) {
      if (!name || !categorie) {
        alert('Veuillez remplir tous les champs');
      } else {
        const invitedUsersArray = isPrivate
          ? invitedUsers.split(',').map(user => user.trim())
          : [];
        sendMessage({
          action: 'create_chatroom',
          name,
          categorie,
          isPrivate,
          invitedUsers: invitedUsersArray,
          creatorId: userId,
        });
        navigation.goBack();
      }
    } else {
      alert('Erreur de connexion WebSocket');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nom de la messagerie"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Catégorie"
        value={categorie}
        onChangeText={setCategorie}
        style={styles.input}
      />

      <View style={styles.switchContainer}>
        <Text>Salon privé</Text>
        <Switch value={isPrivate} onValueChange={setIsPrivate} />
      </View>

      {isPrivate && (
        <TextInput
          placeholder="Inviter des utilisateurs (séparés par des virgules)"
          value={invitedUsers}
          onChangeText={setInvitedUsers}
          style={styles.input}
        />
      )}

      <Button title="Créer" onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default CreateChatroomScreen;
