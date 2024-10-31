import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native-animatable';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';
const NotFouundGIf = require("../assets/images/marca.png");

export default function NotFoudMessageList() {
    return (
        <ScrollView style={styles.button} >
            <Image source={NotFouundGIf}
                resizeMode='contain'
                style={styles.image} />
            <Text>Nenhum conteúdo encontrado</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    button: {
        flex:1,
        padding: 10,
       
    },
    image: {
        flex: 1,
        width: 200,
        height: 200
    }
});
