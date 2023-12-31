// screens/CreateChatroomScreen.js

import React, {useState} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import useWebSocket from './useWebSocket'; // Assurez-vous que le chemin est correct

const CreateChatroomScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const {isConnected, sendMessage} = useWebSocket('ws://192.168.1.127:9000');

  const handleCreate = () => {
    if (isConnected) {
      sendMessage({action: 'create_chatroom', name});
      navigation.goBack();
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
