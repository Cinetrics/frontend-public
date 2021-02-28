import './App.css';
import React from 'react';
import Home from './components/Home.js';
import Register from './components/Register.js';
import {Provider as PaperProvider} from "react-native-paper";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const theme = {
    dark: false,
    roundness: 4,
    colors: {
      primary: '#1BB55C',
      accent: '#1BB55C',
      background: '#FFFFFF',
      surface: '#1BB55C',
      text: '#001021',
      error: '#B71F0E',
      disabled: '#BEC6C6',
      placeholder: '#1481BA',
      backdrop: '#1BB55C',
    },
    fonts: {

    },
    animation: {
      scale: 1.0,
    }
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
    <NavigationContainer>{
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} options={{ title: 'Cinetrics' }} />
        <Stack.Screen name="Register" component={Register} options={{ title: 'Cinetrics' }} />
      </Stack.Navigator>
    }</NavigationContainer>
  </PaperProvider>
  );
}
