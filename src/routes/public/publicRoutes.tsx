import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import PreLogin from '../../pages/authentication/PreLogin';
import Login from '../../pages/authentication/Login';
import ChangePassword from '../../pages/authentication/ChangePassword';
import SendEmail from '../../pages/authentication/SendEmail';
import CheckCode from '../../pages/authentication/CheckCode';
import CreateAccount from '../../pages/authentication/CreateAccount';
import FinishRegistration from '../../pages/authentication/FinishRegistration';


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