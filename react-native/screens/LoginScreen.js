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
      //bonjour
      // Remplacez par l'URL de votre backend
      console.log('ici');
      const response = await axios.post(
        'http://10.93.164.254/tp_final/login.php',
        {
          username,
          password,
        },
      );
      console.log('username', username, 'password', password);
      if (response.data.success) {
        setUserId(response.data.user.id);
        console.log(response.data.user.id);
        navigation.navigate('MessageList', {userId: response.data.user.id});
      } else {
        alert('Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      alert('Erreur lors de la connexion');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        'http://10.93.164.254/tp_final/signup.php',
        {username, password},
      );
      if (response.data.success) {
        navigation.navigate('MessageList', {userId: response.data.user.id});
      } else {
        alert('Erreur lors de la création du compte');
      }
    } catch (error) {
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
