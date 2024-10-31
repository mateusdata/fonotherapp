import React from 'react';
import { View } from 'react-native-animatable';
import { Image,  StyleSheet, Text } from 'react-native';
const NotFouundGIf = require("../assets/images/notFound.gif");

export default function NotFoudMessageList() {
    return (
        <View style={styles.button} >
            <Image source={{uri:"https://cdni.iconscout.com/illustration/premium/thumb/not-found-illustration-download-in-svg-png-gif-file-formats--404-error-page-pack-network-communication-illustrations-6167023.png"}}
                resizeMode='cover'
                style={styles.image} />
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
