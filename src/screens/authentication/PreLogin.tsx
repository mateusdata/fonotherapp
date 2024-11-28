import React from 'react';
import { Image, Text, Pressable, View } from 'react-native';
import { Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as  Animatable from "react-native-animatable"
import { api } from '../../config/Api';
import { LinearGradient } from 'expo-linear-gradient';
import { styleGradient } from '../../style/styleGradient';
import PrimaryButton from '../../components/primaryButton';


const PreLogin = ({ navigation }: any) => {

    return (
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "#F5F7FF" }}>
            <StatusBar animated hideTransitionAnimation='fade' style='dark' />

            <Animatable.Image animation={"fadeInRight"} style={{ flex: 0.4, width: "100%" }}
                source={require("../../assets//images/prelogin.png")} />

            <View style={{ flex: 0.6, justifyContent: "flex-start", width: "100%", alignItems: "center" }}>
                <LinearGradient
                    colors={[
                        'hsla(320, 100%, 95%, 1)',
                        'hsla(320, 100%, 99%, 1)',
                        'hsla(210, 100%, 97%, 1)',
                        'hsla(205, 100%, 95%, 1)',
                        'hsla(313, 100%, 98%, 1)'
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styleGradient.background}
                />
                <View style={{ width: "80%", gap: 5, marginTop: 0 }}>

                    <Animatable.View animation="fadeInLeft">
                        <Text style={{ color: "black", fontSize: 25, textAlign: "center", paddingTop: 15, paddingBottom: 10 }}>
                            Descubra o seu melhor com o FonotherApp
                        </Text>
                        <Text style={{ fontSize: 16, textAlign: "center" }}>
                            Explore diversas possibilidades e tenha a
                        </Text>
                        <Text style={{ fontSize: 16, textAlign: "center" }}>
                            sua terapia na palma da mão
                        </Text>

                    </Animatable.View>
                </View>
                <View style={{ width: "90%", marginTop: 25, gap: 5 }} >
                    <View style={{ padding: 0 }}>
                        <Button
                            testID='create-account'
                            style={{ padding: 5 }}
                            buttonColor='#36B3B1'
                            onPress={() => navigation.navigate("CreateAccount")}

                            textColor={"white"}
                        >
                            Criar conta
                        </Button>
                    </View>
                    <Button testID='login' focusable mode='contained-tonal' onPress={() => navigation.navigate("Login")} style={{
                        borderColor: "#daebf2", backgroundColor: "#ECF2FF", padding: 2, borderWidth: 1,
                        marginTop: 6
                    }}>
                        Login
                    </Button>


                </View>
            </View>
        </View>
    );

}

export default PreLogin