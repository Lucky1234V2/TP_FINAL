import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import UserContext from './UserContext';
import ChatroomScreen from './screens/ChatroomScreen';
import ChatroomSettingsScreen from './screens/ChatroomSettingsScreen';
import CreateChatroomScreen from './screens/CreateChatroomScreen';
import LoginScreen from './screens/LoginScreen';
import MessageListScreen from './screens/MessageListScreen';

function App() {
  const Stack = createNativeStackNavigator();
  const [userId, setUserId] = useState(null);
  return (
    <NavigationContainer>
      <UserContext.Provider value={{userId, setUserId}}>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MessageList" component={MessageListScreen} />
          <Stack.Screen
            name="CreateChatroom"
            component={CreateChatroomScreen}
          />
          <Stack.Screen name="Chatroom" component={ChatroomScreen} />
          <Stack.Screen
            name="ChatroomSettings"
            component={ChatroomSettingsScreen}
          />
        </Stack.Navigator>
      </UserContext.Provider>
    </NavigationContainer>
  );
}

export default App;
