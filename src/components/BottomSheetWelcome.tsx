import React, { useContext, useEffect, useState } from 'react';
import { Platform, View, Text, Image } from 'react-native';
import HeaderSheet from './HeaderSheet';
import { Sheet } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons'; // Certifique-se de que o pacote está instalado
import { colorPrimary } from '../constants/ColorPalette';
import { Context, useAuth } from '../context/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { styleGradient } from '../constants/styleGradient';
import LinearCustomGradient from './LinearCustomGradient';

export default function BottomSheetWelcome({ size }: any) {
  const { user, showSheetWelcome, setShowSheetWelcome } = useAuth()
  useEffect(() => {
    setTimeout(() => {
       setShowSheetWelcome(false)
    }, 8000);
  }, [])
  
  return (
    <Sheet
      modal
      open={showSheetWelcome}
      dismissOnSnapToBottom
      animation="medium"
      onOpenChange={(isOpen) => setShowSheetWelcome(isOpen)}
      snapPoints={[size]}

    >

      <Sheet.Overlay />
      <Sheet.Frame style={{ borderTopEndRadius: 15, borderTopStartRadius: 15 }}>
        <LinearCustomGradient />
        <HeaderSheet />
        <View style={{ backgroundColor: 'transparent', maxWidth: "100%", minWidth: "100%", paddingHorizontal: 15, flex: 1 }}>

          <View style={{ alignItems: 'center', justifyContent: 'center', }}>
            <Image resizeMode='contain' style={{ width: 80, height: 82, }}
              source={require("../assets/images/logo.png")}
            />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
            Bem-vindo, {user?.person?.name || 'usuário(a)'}!
          </Text>
          <Text style={{ fontSize: 18, textAlign: 'center', marginVertical: 10 }}>
            Descubra o seu melhor com o FonotherApp.
          </Text>
          <Text style={{ fontSize: 16, textAlign: 'center', color: 'gray' }}>
            Estamos muito felizes em ter você aqui! Aproveite tudo que o nosso app tem a oferecer.
          </Text>
        </View>
      </Sheet.Frame>
    </Sheet>
  );
}
