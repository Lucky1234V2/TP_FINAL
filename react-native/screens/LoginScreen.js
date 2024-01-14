import axios from 'axios';
import React, {useContext, useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import UserContext from '../UserContext';
import logo from '../assets/logo.png';
import styles from '../styles/LoginScreenStyles';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setUserId} = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://192.168.1.127:8000/auth/login.php',
        {
          username,
          password,
        },
      );
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
        'http://192.168.1.127:8000/auth/signup.php',

        {username, password},
      );
      if (response.data.success) {
        alert('Compte créé avec succès');
      } else {
        alert(response.data.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.log('Erreur lors de la création du compte:', error);
      alert('Erreur lors de la création du compte');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={username => setUsername(username)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Mdp"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
        />
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>Connexion</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignup} style={styles.loginBtn}>
        <Text style={styles.loginText}>Inscription</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
