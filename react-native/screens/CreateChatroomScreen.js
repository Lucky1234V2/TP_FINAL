// screens/CreateChatroomScreen.js

import axios from 'axios';
import React, {useState} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';

const CreateChatroomScreen = ({navigation}) => {
  const [name, setName] = useState('');

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        'http://192.168.43.20/tp_final/create_chatroom.php',
        {name},
      );
      if (response.data.success) {
        navigation.goBack();
      } else {
        alert('Erreur lors de la création de la messagerie');
      }
    } catch (error) {
      alert('Erreur lors de la création de la messagerie');
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
