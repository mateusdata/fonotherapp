import React from 'react';
import { View } from 'react-native-animatable';
import { Image,  StyleSheet, Text } from 'react-native';

export default function NotFoudMessageList() {
    return (
        <View style={styles.button} >
            <Text style={styles.text}>Nenhum conteúdo encontrado</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 20,
        justifyContent:"center",
        alignItems:"center"
       
    },
    image: {
        width: "80%",
        height: 200
    },
    text:{
        fontSize:18
    }
});
