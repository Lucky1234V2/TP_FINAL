import axios from 'axios';
import React, {useContext, useState} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import UserContext from '../UserContext';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setUserId} = useContext(UserContext);

  const handleLogin = async () => {
    try {
      // Remplacez par l'URL du reseau à chaque fois que vous lancez le projet

      const response = await axios.post('http://192.168.1.127:8000/login.php', {
        username,
        password,
      });
      if (response.data.success) {
        setUserId(response.data.user.id);
        navigation.navigate('MessageList', {userId: response.data.user.id});
      } else {
        alert('Erreur de connexion');
      }
    } catch (error) {
      alert('Erreur lors de la connexion');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        'http://192.168.1.127:8000/signup.php',
        {username, password},
      );
      if (response.data.success) {
        navigation.navigate('MessageList', {userId: response.data.user.id});
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.log('test', error);
      alert('Erreur lors de la création du compte');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Se connecter" onPress={handleLogin} />
      <Button title="Créer un compte" onPress={handleSignup} />
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

export default LoginScreen;
