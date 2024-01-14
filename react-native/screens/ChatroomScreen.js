import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import UserContext from '../UserContext';

const ChatroomScreen = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [webSocket, setWebSocket] = useState(null);
  const chatroomId = route.params.chatroomId;
  const {userId} = useContext(UserContext);

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.127:9000');

    ws.onopen = () => {
      console.log('WebSocket Connected');
      ws.send(JSON.stringify({action: 'join', chatroomId}));
    };

    ws.onmessage = e => {
      const receivedData = JSON.parse(e.data);
      if (Array.isArray(receivedData)) {
        setMessages(receivedData);
      } else {
        setMessages(prevMessages => [...prevMessages, receivedData]);
      }
    };

    ws.onerror = e => {
      console.log(e.message);
    };

    ws.onclose = e => {
      console.log('WebSocket Disconnected');
    };

    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        action: 'message',
        chatroom_id: chatroomId,
        user_id: userId,
        message: newMessage,
      };

      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(message));
        setNewMessage('');
      } else {
        alert("Erreur lors de l'envoi du message");
      }
    } else {
      alert('Veuillez remplir le champ de message');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.message}>
            <Text>{item.message}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Écrire un message..."
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
        />
        <Button title="Envoyer" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  message: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
  },
});

export default ChatroomScreen;
