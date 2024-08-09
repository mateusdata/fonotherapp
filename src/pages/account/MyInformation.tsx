import React, { useContext, useEffect, useState } from 'react'
import { Alert, Pressable, View } from 'react-native'
import { MaterialIcons, Ionicons} from '@expo/vector-icons';
import { Context } from '../../context/AuthProvider';
import { api } from '../../config/Api';
import LabelInput from '../../components/LabelInput';
import { colorPrimary, colorSecundary } from '../../style/ColorPalette';
import CustomText from '../../components/customText';


const MyInformation = ({ navigation }) => {


  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "white", paddingTop: 10 }}>
      <Pressable onPress={() => navigation.navigate("ChangeName")} android_ripple={{ color: colorPrimary }} style={{
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", 
        borderColor: "gray", paddingBottom: 5, width: "100%", paddingHorizontal:15
      }}>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 15, marginTop: 10 }}>
          <Ionicons name="create-outline" size={28} color={colorPrimary} />
          <CustomText fontFamily='Poppins_400Regular' style={{ fontSize: 17 }}>Nome de úsuario</CustomText>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={18} color={colorPrimary} />
      </Pressable>

      <Pressable onPress={() => navigation.navigate("ChangeEmail")} android_ripple={{ color: colorPrimary }} style={{
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", 
        borderColor: "gray", paddingBottom: 5, width: "100%", paddingHorizontal:15
      }}>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 15, marginTop: 10 }}>
          <Ionicons name="at" size={28} color={colorPrimary} />
          <CustomText fontFamily='Poppins_400Regular' style={{ fontSize: 17 }}>Email</CustomText>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={18} color={colorPrimary} />
      </Pressable>

      <Pressable onPress={() => navigation.navigate("ChangeCredential")} android_ripple={{ color: colorPrimary }} style={{
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", 
        borderColor: "gray", paddingBottom: 5, width: "100%", paddingHorizontal:15
      }}>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 15, marginTop: 10 }}>
          <Ionicons name="settings-outline" size={28} color={colorPrimary} />
          <CustomText fontFamily='Poppins_400Regular' style={{ fontSize: 17 }}>Senha</CustomText>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={18} color={colorPrimary} />
      </Pressable>

      <Pressable onPress={() => navigation.navigate("ChangeGovLicense")} android_ripple={{ color: colorPrimary }} style={{
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", 
        borderColor: "gray", paddingBottom: 5, width: "100%", paddingHorizontal:15
      }}>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 15, marginTop: 10 }}>
          <Ionicons name="id-card-outline" size={28} color={colorPrimary} />
          <CustomText fontFamily='Poppins_400Regular' style={{ fontSize: 17 }}>CRFA</CustomText>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={18} color={colorPrimary} />
      </Pressable>

      <Pressable onPress={() => navigation.navigate("ChangePhone")} android_ripple={{ color: colorPrimary }} style={{
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", 
        borderColor: "gray", paddingBottom: 5, width: "100%", paddingHorizontal:15
      }}>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 15, marginTop: 10 }}>
          <Ionicons name="phone-portrait-outline" size={28} color={colorPrimary} />
          <CustomText fontFamily='Poppins_400Regular' style={{ fontSize: 17 }}>Telefone</CustomText>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={18} color={colorPrimary} />
      </Pressable>
      
    </View>
  )
}

export default MyInformation