import axios from 'axios';
import React, {useContext, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import UserContext from '../UserContext';
import logo from '../assets/logo.png'; // Assurez-vous que le chemin est correct

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setUserId} = useContext(UserContext);

  const handleLogin = async () => {
    try {
      // Remplacez par l'URL du reseau à chaque fois que vous lancez le projet

      const response = await axios.post('http://192.168.43.20:8000/login.php', {
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
        'http://192.168.43.20:8000/signup.php',
        {username, password},
      );
      if (response.data.success) {
        alert('Compte créé avec succès');
        // Optionnel : Rediriger vers l'écran de connexion
        // navigation.navigate('Login');
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  image: {
    marginBottom: 20,
  },

  inputView: {
    backgroundColor: '#cbcbcb',
    borderRadius: 10,
    width: '55%',
    height: 45,
    marginBottom: 20,
    textAlign: 'center',
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    width: '50%',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#a0cc95',
  },
});

export default LoginScreen;
