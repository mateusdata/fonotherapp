import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colorPrimary } from '../../style/ColorPalette';
import { useNavigation } from '@react-navigation/native';

type ConfigOption = {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const configOptions: ConfigOption[] = [
  { id: '1', name: 'Notificações', icon: 'notifications' },
  { id: '2', name: 'Segurança', icon: 'security' },
  { id: '3', name: 'Permissões do App', icon: 'app-settings-alt' },
  { id: '4', name: 'Checar Atualizações', icon: 'system-update' },
];

export default function Configuration() {
  const navigation = useNavigation<any>();

  const handleOptionPress = async (name: string) => {
    switch (name) {
      case 'Notificações':
      case 'Permissões do App':
        // Abrir configurações do aplicativo
        const url = Platform.OS === 'android' 
          ? 'app-settings:' 
          : 'app-settings:';
        Linking.openURL(url);
        break;
      case 'Segurança':
        navigation.navigate('SecuritySettings'); // Navegar para a tela de segurança
        break;
      case 'Checar Atualizações':
        // Abrir Play Store ou App Store
        const appStoreUrl = Platform.OS === 'android'
          ? 'https://play.google.com/store/apps/details?id=com.seuapp' // Substitua 'com.seuapp' pelo seu ID do pacote
          : 'https://apps.apple.com/app/idSEU_APP_ID'; // Substitua 'SEU_APP_ID' pelo ID do seu aplicativo na App Store
        Linking.openURL(appStoreUrl);
        break;
      default:
        Alert.alert('Opção Selecionada', `Você clicou em: ${name}`);
    }
  };

  const renderItem = ({ item }: { item: ConfigOption }) => (
    <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionPress(item.name)}>
      <MaterialIcons name={item.icon} size={30} color={colorPrimary} style={styles.icon} />
      <Text style={styles.optionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={configOptions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginRight: 20,
  },
  optionText: {
    fontSize: 18,
    color: '#000',
  },
});
