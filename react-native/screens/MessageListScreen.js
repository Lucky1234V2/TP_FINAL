// screens/MessageListScreen.js

import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import UserContext from '../UserContext';
import styles from '../styles/MessageListScreenStyles';

const MessageListScreen = ({navigation}) => {
  const [chatrooms, setChatrooms] = useState([]);
  const {setUserId, userId} = useContext(UserContext);
  const [selectedCategorie, setSelectedCategorie] = useState('Toutes');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    setUserId(null);
    navigation.navigate('Login');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Salons de discussion',
      headerLeft: () => (
        <View style={styles.logoutButtonContainer}>
          <Button onPress={handleLogout} title="Quitter" color="#a0cc95" />
        </View>
      ),
    });
  }, [navigation, setUserId]);

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://192.168.1.127:9000?userId=${userId}`);

    ws.current.onopen = () => {
      console.log('WebSocket Connected', userId);
      ws.current.send(JSON.stringify({action: 'get_chatrooms', userId}));
    };

    ws.current.onmessage = e => {
      const receivedData = JSON.parse(e.data);
      if (receivedData.action === 'error') {
        Alert.alert('Erreur', receivedData.message);
      } else if (receivedData.action === 'update_chatrooms') {
        const groupedData = groupByCategory(receivedData.chatrooms);
        setChatrooms(groupedData);
      }
    };

    ws.onerror = e => {
      console.log('WebSocket Error: ', e.message);
    };

    ws.onclose = e => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      if (ws && typeof ws.close === 'function') {
        ws.close();
      }
    };
  }, []);

  const groupByCategory = chatrooms => {
    const grouped = chatrooms.reduce((acc, chatroom) => {
      (acc[chatroom.categorie] = acc[chatroom.categorie] || []).push(chatroom);
      return acc;
    }, {});

    return Object.keys(grouped).map(key => ({
      categorie: key,
      chatrooms: grouped[key],
    }));
  };

  const renderCategory = ({item}) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryHeader}>{item.categorie}</Text>
      {item.chatrooms.map(chatroom => (
        <TouchableOpacity
          key={chatroom.id}
          style={styles.itemContainer}
          onPress={() =>
            navigation.navigate('Chatroom', {chatroomId: chatroom.id})
          }>
          <Text style={styles.itemText}>{chatroom.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const filterChatroomsByCategorie = () => {
    if (selectedCategorie === 'Toutes') {
      return chatrooms;
    }
    return chatrooms.filter(
      chatroom => chatroom.categorie === selectedCategorie,
    );
  };

  const categories = [
    'Toutes',
    ...new Set(chatrooms.map(chatroom => chatroom.categorie)),
  ];
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.chooseCategoryButton}>
        <Text style={styles.chooseCategoryText}>Choisir une catégorie</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          {categories.map(categorie => (
            <TouchableOpacity
              key={categorie}
              onPress={() => {
                setSelectedCategorie(categorie);
                setModalVisible(false);
              }}>
              <Text style={styles.modalText}>{categorie}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <FlatList
        data={filterChatroomsByCategorie()}
        keyExtractor={item => item.categorie}
        renderItem={renderCategory}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('CreateChatroom')}
        style={styles.createChatroomButton}>
        <Text style={styles.createChatroomButtonText}>
          Créer une messagerie
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MessageListScreen;
