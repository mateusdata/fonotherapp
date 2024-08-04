import React from 'react';
import { Text, View } from 'react-native';
import {  useFonts, Poppins_600SemiBold, Poppins_800ExtraBold} from '@expo-google-fonts/poppins';

const FazerLogin = () => {
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold, Poppins_800ExtraBold
      });
    
      if (!fontsLoaded) {
        return null;
      }
    return (
        <View style={{ width: "auto", alignItems: "center", justifyContent: "center", marginTop: 15 }}>
            <Text style={{ fontFamily: "Poppins_600SemiBold", color: "gray" }}>Não tem uma conta</Text>
            <Text style={{ fontFamily: "Poppins_600SemiBold", color: "#407AFF" }}>Criar uma conta</Text>
        </View>
    )
}

export default FazerLogin