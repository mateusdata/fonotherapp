import React from 'react';
import { View, Pressable, Linking, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import CustomText from '../../components/customText';
import { colorPrimary } from '../../style/ColorPalette';

const Help = () => {

  const handlePressWhatsAppMessage = async () => {
    const message = 'Olá, estou usando o app Fonotheapp e preciso de ajuda.';
    const url = `whatsapp://send?phone=557599787828&text=${message}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      // Handle case when WhatsApp is not available
    }
  };

  const handlePressEmail = async () => {
    const email = 'fonoterapp@gmail.com';
    const subject = 'Ajuda com o app Fonotheapp';
    const body = 'Olá, preciso de assistência com o app Fonotheapp.';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      // Handle case when email client is not available
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Fale Conosco</CustomText>
      <CustomText style={styles.description}>Estamos aqui para ajudar. Escolha uma das opções abaixo para entrar em contato.</CustomText>
      
      <Pressable style={[styles.button, {backgroundColor:colorPrimary}]} onPress={handlePressWhatsAppMessage}>
        <Ionicons name="logo-whatsapp" size={20} color="white" />
        <CustomText style={styles.buttonText}>WhatsApp</CustomText>
      </Pressable>

      <Pressable style={[styles.button, {backgroundColor:colorPrimary}]} onPress={handlePressEmail}>
        <MaterialIcons name="email" size={20} color="white" />
        <CustomText style={styles.buttonText}>E-mail</CustomText>
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
