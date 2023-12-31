// screens/MessageListScreen.js

import React, {useEffect, useRef, useState} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';

const MessageListScreen = ({navigation}) => {
  const [chatrooms, setChatrooms] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.1.127:9000');

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      ws.current.send(JSON.stringify({action: 'get_chatrooms'}));
    };

    ws.current.onmessage = e => {
      const receivedData = JSON.parse(e.data);
      if (receivedData.action === 'update_chatrooms') {
        setChatrooms(receivedData.chatrooms);

      }
    };

    ws.onerror = e => {
      console.log('WebSocket Error: ', e.message);
    };

    ws.onclose = e => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      ws.close();
    };
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
