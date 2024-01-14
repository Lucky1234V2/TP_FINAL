import React, {useContext, useState} from 'react';
import {Alert, Button, TextInput, View} from 'react-native';
import UserContext from '../UserContext';
import useWebSocket from '../screens/useWebSocket';
import styles from '../styles/ChatroomSettingsScreenStyles';

interface ChatroomSettingsScreenProps {
  route: {
    params: {
      chatroomId: number;
    };
  };
  navigation: any; // Add the navigation property
}

const ChatroomSettingsScreen: React.FC<ChatroomSettingsScreenProps> = ({
  route,
  navigation, // Add the navigation property
}) => {
  const {chatroomId} = route.params;
  const {userId} = useContext(UserContext);
  const {sendMessage} = useWebSocket(
    `ws://192.168.1.127:9000?userId=${userId}`,
  );
  const [newName, setNewName] = useState<string>('');
  const [newCategorie, setNewCategorie] = useState<string>('');

  const handleDeleteChatroom = () => {
    sendMessage({action: 'delete_chatroom', chatroomId});
    Alert.alert(
      'Chatroom Deleted',
      'The chatroom has been successfully deleted.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MessageList', {refresh: true}),
        },
      ],
    );
  };

  const handleUpdateChatroom = () => {
    sendMessage({action: 'update_chatroom', chatroomId, newName, newCategorie});
    Alert.alert(
      'Chatroom Updated',
      'The chatroom has been successfully updated.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MessageList', {refresh: true}),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="New Chatroom Name"
        value={newName}
        onChangeText={setNewName}
        style={styles.input}
      />
      <TextInput
        placeholder="New Chatroom Categorie"
        value={newCategorie}
        onChangeText={setNewCategorie}
        style={styles.input}
      />
      <Button title="Update Chatroom" onPress={handleUpdateChatroom} />
      <Button
        title="Delete Chatroom"
        onPress={handleDeleteChatroom}
        color="red"
      />
    </View>
  );
};

export default ChatroomSettingsScreen;
