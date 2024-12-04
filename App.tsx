import { NavigationContainer } from '@react-navigation/native';
import AuthProvider from './src/context/AuthProvider';
import Routes from './src/routes/routes';
import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config';
import { useFonts, Poppins_600SemiBold, Poppins_800ExtraBold, Poppins_300Light } from '@expo-google-fonts/poppins';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import PacientContext from './src/context/PacientContext';
import GlobalContext from './src/context/GlobalContext';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';

export default function App() {
  const [tamaguiLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para notificações não concedida');
      }
    };
    requestNotificationPermissions();
   
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold, Poppins_800ExtraBold, Poppins_300Light
  });

  if (!fontsLoaded || !tamaguiLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <>
        <NavigationContainer>
          <GlobalContext>
            <TamaguiProvider config={config}>
              <AuthProvider>
                  <PacientContext>
                    <Routes />
                  </PacientContext>
              </AuthProvider>
            </TamaguiProvider>
          </GlobalContext>
        </NavigationContainer>
        <Toast />
      </>

    </GestureHandlerRootView>
  );
}
