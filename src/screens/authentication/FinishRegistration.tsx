import React from 'react';
import { View, StatusBar, Image, Linking } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { styleGradient } from '../../style/styleGradient';
import { colorGreen, colorPrimary } from '../../style/ColorPalette';
import AntDesign from '@expo/vector-icons/AntDesign';

const ImageTerminate = require("../../assets/images/animate.gif"); 

interface FormatUser {
    nick_name: string,
    email: string
}
const FinishRegistration = ({ navigation, route }) => {
    const { user } = route.params;
    const handleEmailPress = () => {
        Linking.openURL(`mailto:${user?.email}`);
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", paddingTop:20, backgroundColor: "#F5F7FF" }}>
              <LinearGradient
                colors={[
                    'hsla(320, 100%, 98%, 1)',
                    'hsla(320, 100%, 99%, 1)',
                    'hsla(320, 100%, 99%, 1)',
                    'hsla(205, 100%, 95%, 1)',
                    'hsla(313, 100%, 98%, 1)'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styleGradient.background}
            />
            <View style={{justifyContent:"center", alignItems:"center", padding:12,}}>

                <StatusBar animated={true} barStyle='light-content' />
                <Text style={{ fontSize: 25, color: colorPrimary }}>{`Olá ${user?.nick_name}`}</Text>
                <Text style={{ fontSize: 18, top:2}}>Verifique seu email {user?.email}</Text>
                <Text style={{ fontSize: 18, top:2}}> para ativar sua conta</Text>
                <AntDesign style={{padding:10}} name="checkcircle" size={34} color={colorGreen} />               
                
                <Button
                    testID='created-account'
                    mode="contained"
                    onPress={() => navigation.navigate("Login")}
                    style={{ marginTop: 5, backgroundColor: colorPrimary }}
                >
                   Fazer login
                </Button>
            </View>
        </View>
    );
}

export default FinishRegistration;
