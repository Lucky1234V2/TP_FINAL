// screens/ChatroomScreen.js
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
    // Remplacer 'ws://votre_serveur_websocket' par l'URL de votre serveur WebSocket
    const ws = new WebSocket('ws://192.168.1.127:9000');

    ws.onopen = () => {
      console.log('WebSocket Connected');
      ws.send(JSON.stringify({action: 'join', chatroomId}));
    };

    ws.onmessage = e => {
      const receivedData = JSON.parse(e.data);
      if (Array.isArray(receivedData)) {
        // Si c'est une liste de messages (lors de la connexion initiale)
        setMessages(receivedData);
      } else {
        // Si c'est un seul message (nouveau ou modifié)
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

  const handleEditMessage = async messageId => {
    try {
      const response = await axios.post(
        'http://10.93.164.254/tp_final/edit_message.php',
        {
          message_id: messageId,
          new_message: newMessage,
        },
      );
      if (response.data.success) {
        setMessages(prevMessages =>
          prevMessages.map(item =>
            item.id === messageId ? {...item, message: newMessage} : item,
          ),
        );
        setEditingMessage(null);
        setNewMessage('');
      } else {
        alert(
          'Erreur lors de la modification du message : ' +
            response.data.message,
        );
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      alert('Erreur lors de la modification du message');
    }
  };

  const handleDeleteMessage = async messageId => {
    try {
      const response = await axios.post(
        'http://10.93.164.254/tp_final/delete_message.php',
        {message_id: messageId},
      );

      console.log('response', response.data);

      if (response.data.success) {
        setMessages(messages.filter(item => item.id !== messageId));
      } else {
        alert('Erreur lors de la suppression du message');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      alert('Erreur lors de la suppression du message');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        renderItem={({item}) => (
          <View style={styles.message}>
            {editingMessage === item.id ? (
              <View>
                <TextInput
                  value={newMessage}
                  onChangeText={setNewMessage}
                  style={styles.input}
                />
                <Button
                  title="Enregistrer"
                  onPress={() => handleEditMessage(item.id)}
                />
              </View>
            ) : (
              <View>
                <Text>{item.message}</Text>
                <Text style={styles.timestamp}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
                <Button
                  title="Modifier"
                  onPress={() => setEditingMessage(item.id)}
                />
                <Button
                  title="Supprimer"
                  onPress={() => handleDeleteMessage(item.id)}
                />
              </View>
            )}
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

// // screens/ChatroomScreen.js

// import axios from 'axios';
// import {default as React, useContext, useEffect, useState} from 'react';
// import {
//   Button,
//   FlatList,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
// import UserContext from '../UserContext';

// const ChatroomScreen = ({route, navigation}) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const chatroomId = route.params.chatroomId;
//   const {userId} = useContext(UserContext);

//   console.log(route);
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.post(
//           'http://10.93.170.23/tp_final/list_messages.php',
//           {chatroom_id: chatroomId},
//         );
//         setMessages(response.data);
//       } catch (error) {
//         alert('Erreur lors de la récupération des messages');
//       }
//     };

//     fetchMessages();
//   }, []);

//   const handleSendMessage = async () => {
//     if (newMessage.trim() !== '') {
//       try {
//         console.log(userId);
//         const response = await axios.post(
//           'http://10.93.170.23/tp_final/send_message.php',
//           {
//             chatroom_id: chatroomId,
//             user_id: userId, // remplacer par l'ID de l'utilisateur connecté
//             message: newMessage,
//           },
//         );
//         if (response.data.success) {
//           setMessages([
//             ...messages,
//             {message: newMessage, timestamp: new Date().toISOString()},
//           ]);
//           setNewMessage('');
//         } else {
//           alert("Erreur lors de l'envoi du message");
//         }
//       } catch (error) {
//         alert("Erreur lors de l'envoi du message");
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={item => item.id}
//         renderItem={({item}) => (
//           <View style={styles.message}>
//             <Text>{item.message}</Text>
//             <Text style={styles.timestamp}>
//               {new Date(item.timestamp).toLocaleTimeString()}
//             </Text>
//           </View>
//         )}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           placeholder="Écrire un message..."
//           value={newMessage}
//           onChangeText={setNewMessage}
//           style={styles.input}
//         />
//         <Button title="Envoyer" onPress={handleSendMessage} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   message: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: 'gray',
//   },
//   timestamp: {
//     fontSize: 10,
//     color: 'gray',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginRight: 10,
//     padding: 10,
//   },
// });

// export default ChatroomScreen;
