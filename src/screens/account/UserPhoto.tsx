import React from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';
import { FormatUser } from '../../interfaces/globalInterface';

const { width, height } = Dimensions.get('window');

export default function UserPhoto({ route }) {
  const image = route.params.image;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="contain" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  image: {
    width: '100%',  // 100% da largura do contêiner
    aspectRatio: 1,  // Manter a proporção da imagem
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
  },
});
