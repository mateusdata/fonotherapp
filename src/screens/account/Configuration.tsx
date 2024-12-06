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
    if(name === "Segurança"){
      navigation.navigate('SecuritySettings'); 
    }
    else if (name === "Checar Atualizações"){
      const appStoreUrl = Platform.OS === 'android'
      ? 'https://play.google.com/store/apps/details?id=com.projetofono.fonotherapp&hl=pt_BR' 
      : 'https://www.apple.com/br/search/fonotherapp?src=serp'; 
     Linking.openURL(appStoreUrl);
   
    }
    else{
      Linking.openSettings().catch(err => console.error("Failed to open settings:", err))
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
