// screens/CreateChatroomScreen.js

import React, {useState} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import useWebSocket from './useWebSocket'; // Assurez-vous que le chemin est correct

const CreateChatroomScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [categorie, setCategorie] = useState('');
  const {isConnected, sendMessage} = useWebSocket('ws://192.168.1.127:9000');

  const handleCreate = () => {
    if (isConnected) {
      if (!name || !categorie) {
        alert('Veuillez remplir tous les champs');
      } else {
        sendMessage({action: 'create_chatroom', name, categorie});
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
});

export default CreateChatroomScreen;
