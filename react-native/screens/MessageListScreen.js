// screens/MessageListScreen.js

import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';

const MessageListScreen = ({navigation}) => {
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const response = await axios.get(
          'http://192.168.1.127:8000/list_chatrooms.php',
        );
        setChatrooms(response.data);
      } catch (error) {
        alert('Erreur lors de la récupération des messageries');
      }
    };

    fetchChatrooms();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={chatrooms}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.chatroom}>
            <Text>{item.name}</Text>
            <Button
              title="Ouvrir"
              onPress={() =>
                navigation.navigate('Chatroom', {chatroomId: item.id})
              }
            />
          </View>
        )}
      />
      <Button
        title="Créer une messagerie"
        onPress={() => navigation.navigate('CreateChatroom')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  chatroom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default MessageListScreen;
