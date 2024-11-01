import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {
  MaterialIcons,
  SimpleLineIcons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Button, YStack } from 'tamagui';
import { Context } from '../../context/AuthProvider';
import { api } from '../../config/Api';
import LabelInput from '../../components/LabelInput';
import { colorPrimary, colorSecundary } from '../../style/ColorPalette';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-paper';
import CustomText from '../../components/customText';
const MyAccount = ({ navigation }) => {
  const { logOut, user } = useContext(Context);
  const [google, setGoogle] = useState<any>([])
  useEffect(() => {
    async function fectData() {
      const response = await AsyncStorage.getItem("google")
      setGoogle(JSON.parse(response))
    }
    fectData()
  }, [])
  return (
    <YStack backgroundColor='$color1' style={{ flex: 1, padding: 3, borderWidth: 0 }}>
      <YStack space="$3" style={{ borderColor: 'yellow', borderWidth: 0, alignItems: "center", marginTop: 0, marginBottom: 40 }}>
        <YStack style={{ width: '100%', alignItems: 'center', marginTop: 5, top: 22 }}>
          {true && <>
            {!google?.photo ? <FontAwesome6 name="user-doctor" size={56} color={colorPrimary} />
              :
              <Avatar.Image size={100} source={{ uri: google?.photo }} />
            }

            <CustomText style={{ fontSize: 22, marginTop: 10 }} fontFamily='Poppins_400Regular'>
              {user?.nick_name?.charAt(0)?.toUpperCase() + user?.nick_name?.slice(1)}
            </CustomText>
            
          </>}
        </YStack>

      </YStack>

      <View style={{ borderColor: 'red', borderWidth: 0, alignItems: "center", width: "100%", flex: 1, top: 2 }}>
        <Button onPress={() => navigation.navigate("MyInformation")} backgroundColor={'white'} style={{ width: "95%", borderRadius: 6, marginTop: 0, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: 'row', gap: 10, borderColor: 'blue', borderWidth: 0, width: 130 }}>
            <MaterialIcons name="info-outline" size={23} color={colorPrimary} />
            <Text style={{ minWidth: 850, fontSize: 19, color: "#474747" }} >Conta</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={15} color={colorPrimary} />
        </Button>


        <Button onPress={() => navigation.navigate("Help")} backgroundColor={'white'} style={{ width: "95%", borderRadius: 6, marginTop: 0, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: 'row', gap: 10, borderColor: 'blue', borderWidth: 0, width: 130 }}>
            <MaterialCommunityIcons name="help-rhombus-outline" size={23} color={colorPrimary} />
            <Text style={{ minWidth: 850, fontSize: 19, color: "#474747" }} >Ajuda</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={15} color={colorPrimary} />
        </Button>

        <Button onPress={() => navigation.navigate("Feedback")} backgroundColor={'white'} style={{ width: "95%", borderRadius: 6, marginTop: 0, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: 'row', gap: 10, borderColor: 'blue', borderWidth: 0, width: 130 }}>
            <SimpleLineIcons name="directions" size={23} color={colorPrimary} />
            <Text style={{ minWidth: 850, fontSize: 19, color: "#474747" }} >Sugestão</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={15} color={colorPrimary} />
        </Button>


        <Button testID='logout' onPress={logOut} backgroundColor={'white'} style={{ width: "95%", borderRadius: 6, marginTop: 0, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: 'row', gap: 10, borderColor: 'red', borderWidth: 0, width: 130 }}>
            <SimpleLineIcons name="logout" size={23} color={colorPrimary} />
            <Text style={{ minWidth: 850, fontSize: 19, color: "#474747" }} >Sair da conta</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={15} color={colorPrimary} />
        </Button>

        <Button onPress={() => navigation.navigate("Consultancy")} backgroundColor={'white'} style={{ width: "95%", borderRadius: 6, marginTop: 0, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: 'row', gap: 10, borderColor: 'blue', borderWidth: 0, width: 130 }}>
            <MaterialCommunityIcons name="message-badge-outline" size={23} color={colorPrimary} />
            <Text style={{ minWidth: 850, fontSize: 19, color: "#474747" }} >Consultoria</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={15} color={colorPrimary} />
        </Button>
      </View>
    </YStack>
  )
}

export default MyAccount