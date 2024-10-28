import React from 'react';
import { Image, Text, Pressable, View } from 'react-native';
import { Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as  Animatable from "react-native-animatable"
import { api } from '../../config/Api';
import CustomText from '../../components/customText';
import { LinearGradient } from 'expo-linear-gradient';
import { styleGradient } from '../../style/styleGradient';
import PrimaryButton from '../../components/primaryButton';


const PreLogin = ({ navigation }: any) => {

    return (
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "#F5F7FF" }}>
            <StatusBar animated hideTransitionAnimation='fade' style='dark' />

            <Animatable.Image animation={"fadeInRight"} style={{ flex: 0.4, width: "100%" }}
                source={{ uri: 'https://clinicasepam.com.br/wp-content/uploads/2021/06/O-que-e-terapia-da-fala-fono.png' }} />

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
                        <CustomText fontFamily="Poppins_600SemiBold" style={{ color: "#3b3d3d", fontSize: 25, textAlign: "center", paddingTop: 15 }}>
                            Descubra o seu melhor com o fonotherApp
                        </CustomText>
                        <CustomText style={{ fontSize: 16, textAlign: "center" }}>
                            Explore um mundo de saúde e Tenha controle dos seus pacientes com o nosso app de
                        </CustomText>

                    </Animatable.View>
                </View>
                <View style={{ width: "90%", marginTop: 10, gap: 5 }} >
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