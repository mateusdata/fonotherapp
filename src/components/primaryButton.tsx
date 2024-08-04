import React, { useContext } from 'react';
import { StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native';
import { useFonts, Poppins_600SemiBold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';
import AuthProvider, { Context } from '../context/AuthProvider';
import { Button } from 'react-native-paper';

const PrimaryButton = ({ handleButton, name }: any) => {
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold, Poppins_800ExtraBold
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <AuthProvider>
            <Button
            style={{padding:5}}
               buttonColor='#36B3B1'
                onPress={handleButton}
                
                textColor={"white"}
            >
            {name}
            </Button>

        </AuthProvider>
    )

}

const styles = StyleSheet.create({

    button: {
        fontFamily: "Poppins_600SemiBold",
        padding: 5,
        alignItems: 'center',
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "center",
        gap: 0
    },
    buttonText: {
        fontFamily: "Poppins_800ExtraBold",
        color: '#f4f4f4',
        fontWeight: 'bold',
        fontSize: 17
    },
});
export default PrimaryButton