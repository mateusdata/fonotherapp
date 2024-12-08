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
import Toast, { BaseToast } from 'react-native-toast-message';
import { Alert } from 'react-native';
import { colorPrimary } from './src/style/ColorPalette';



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
        <NavigationContainer>
          <GlobalContext>
            <TamaguiProvider config={config}>
              <AuthProvider>
                  <PacientContext>
                    <Routes />
                    <Toast config={toastConfig} position="bottom" bottomOffset={5} />

                  </PacientContext>
              </AuthProvider>
            </TamaguiProvider>
          </GlobalContext>
        </NavigationContainer>

    </GestureHandlerRootView>
  );
}


const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green",
        backgroundColor: "#388E3C",
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 13,
        color: 'white',
        textAlign: 'center',
      }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colorPrimary,
        backgroundColor: colorPrimary,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
      }}
      text2Style={{
        fontSize: 13,
        color: 'white',
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colorPrimary,
        backgroundColor: colorPrimary,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
      }}
      text2Style={{
        fontSize: 13,
        color: 'white',
      }}
    />
  ),
};
