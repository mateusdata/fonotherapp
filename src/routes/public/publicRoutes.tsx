import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import PreLogin from '../../pages/PreLogin';
import Login from '../../pages/login';
import ChangePassword from '../../pages/changePassword';
import SendEmail from '../../pages/sendEmail';
import CheckCode from '../../pages/CheckCode';
import CreateAccount from '../../pages/createAccount';
import { StatusBar } from 'expo-status-bar';
import FinishRegistration from '../../pages/FinishRegistration';





const AppStack = createStackNavigator();
const PublicRoutes = () => {
  return (
    <>
      <StatusBar animated hideTransitionAnimation='fade' style='dark' />

      <AppStack.Navigator screenOptions={{
        headerPressColor: "blue",
        headerStyle: {
          backgroundColor: "#36B3B9"
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
        <AppStack.Screen name="PreLogin" component={PreLogin} options={{
          headerShown: false,
          headerTitle: () => null,
          headerTintColor: "white"
        }} />

        <AppStack.Screen name="Login" component={Login} options={{
          headerShown: true,
          headerTitle: () => null,
          headerTintColor: "white"
        }} />
        <AppStack.Screen name="ChangePassword" component={ChangePassword} options={{
          headerShown: true,
          headerTitle: "Alterar senha",
          headerTintColor: "white"

        }} />
        <AppStack.Screen name="SendEmail" component={SendEmail} options={{
          headerShown: true,
          headerTitle: "Esqueceu a senha",
          headerTintColor: "white"
        }} />

        <AppStack.Screen name="CheckCode" component={CheckCode} options={{
          headerShown: true,
          headerTitle: "Verificar código",
          headerTintColor: "white"
        }} />

        <AppStack.Screen name="CreateAccount" component={CreateAccount} options={{
          headerShown: true,
          headerTitle: "Cadastro",
          headerTintColor: "white"

        }} />

        <AppStack.Screen name="FinishRegistration" component={FinishRegistration} options={{
          headerShown: true,
          headerTitle: "Verifique sua conta",
          headerTitleAlign:"center", 
          headerTintColor:"white"
        }} />

      </AppStack.Navigator>

    </>
  )
}
export default PublicRoutes