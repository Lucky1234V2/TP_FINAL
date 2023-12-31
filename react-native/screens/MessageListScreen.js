// screens/MessageListScreen.js

import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import UserContext from '../UserContext';

const MessageListScreen = ({navigation}) => {
  const [chatrooms, setChatrooms] = useState([]);
  const {setUserId} = useContext(UserContext);
  const [selectedCategorie, setSelectedCategorie] = useState('Toutes');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    setUserId(null); // Mettre à jour le contexte pour vider userId
    navigation.navigate('Login'); // Rediriger vers l'écran de connexion
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
    ws.current = new WebSocket('ws://192.168.1.127:9000');

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      ws.current.send(JSON.stringify({action: 'get_chatrooms'}));
    };

    ws.current.onmessage = e => {
      const receivedData = JSON.parse(e.data);
      if (receivedData.action === 'update_chatrooms') {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  categorieSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categorieButton: {
    padding: 10,
    borderRadius: 5,
  },
  selectedCategorie: {
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  logoutButtonContainer: {
    marginRight: 30,
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  chooseCategoryButton: {
    backgroundColor: '#a0cc95',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  chooseCategoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createChatroomButton: {
    backgroundColor: '#a0cc95',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  createChatroomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MessageListScreen;
