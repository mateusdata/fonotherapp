import React from 'react';
import { View, Pressable, Linking, StyleSheet, Alert, Platform, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colorPrimary } from '../../style/ColorPalette';

const Help = () => {

  const handlePressWhatsAppMessage = async () => {
    const message = 'Olá, estou usando o app FonotherApp e preciso de ajuda.';
    const phone = '557196204608'; // Número do WhatsApp
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    try {
      // Tente abrir o link do WhatsApp
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        Linking.openURL(url);
      } else {
        // Fallback para o WhatsApp Web
        const canOpenWeb = await Linking.canOpenURL(webUrl);
        if (canOpenWeb) {
          Linking.openURL(webUrl);
        } else {
          throw new Error('Cannot open WhatsApp');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp. Tente novamente mais tarde.');
    }
  };

  const handlePressEmail = async () => {
    const email = 'comunicacao.fonotherapp@gmail.com';
    const subject = 'Ajuda com o app Fonotheapp';
    const body = 'Olá, preciso de assistência com o app fonotherApp.';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o cliente de e-mail.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tentar abrir o cliente de e-mail.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fale Conosco</Text>
      <Text style={styles.description}>Estamos aqui para ajudar. Escolha uma das opções abaixo para entrar em contato.</Text>
      
      <Pressable style={[styles.button, {backgroundColor:colorPrimary}]} onPress={handlePressWhatsAppMessage}>
        <Ionicons name="logo-whatsapp" size={20} color="white" />
        <Text style={styles.buttonText}>WhatsApp</Text>
      </Pressable>

      <Pressable style={[styles.button, {backgroundColor:colorPrimary}]} onPress={handlePressEmail}>
        <MaterialIcons name="email" size={20} color="white" />
        <Text style={styles.buttonText}>E-mail</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    maxWidth: 300,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
  },
});

export default Help;
