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
import Toast, { BaseToast } from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';



export default function App() {
  
  const [tamaguiLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });
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

