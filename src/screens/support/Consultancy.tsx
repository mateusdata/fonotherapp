import React from 'react';
import { View, Pressable, Linking, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../../components/customText';
import { colorPrimary } from '../../style/ColorPalette';

const Consultancy = () => {

  const handlePressWhatsAppMessage = async () => {
    const message = 'Olá, estou interessado(a) na consultoria do app FonotherApp.';
    const phone = '557196204608'; // Número do WhatsApp
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        Linking.openURL(url);
      } else if (Platform.OS === 'ios') {
        // Fallback para iOS - WhatsApp Web
        const webUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        Linking.openURL(webUrl);
      } else {
        // Exibe o número de telefone no Android caso o WhatsApp não esteja disponível
        Alert.alert(
          "WhatsApp não disponível",
          `Você não tem o WhatsApp instalado. Pode chamar no número (75)999787828.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Consultoria</CustomText>
      <CustomText style={styles.description}>Estamos aqui para oferecer consultoria. Clique no botão abaixo para entrar em contato.</CustomText>
      
      <Pressable style={[styles.button, {backgroundColor: colorPrimary}]} onPress={handlePressWhatsAppMessage}>
        <Ionicons name="logo-whatsapp" size={20} color="white" />
        <CustomText style={styles.buttonText}>WhatsApp</CustomText>
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

export default Consultancy;
