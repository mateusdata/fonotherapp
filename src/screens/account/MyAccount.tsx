import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Text, Divider, Button } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../../context/AuthProvider';
import { useAuth } from '../../context/AuthProvider';
import UploadAvatar from '../../components/UploadAvatar';
import { colorPrimary } from '../../style/ColorPalette';
import { height } from '../../utils/widthScreen';

const MyAccount = ({ navigation }) => {
  const { logOut, user } = useAuth();
  const [google, setGoogle] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await AsyncStorage.getItem('google');
      setGoogle(JSON.parse(response));
    }
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <UploadAvatar user={user} />
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon={<MaterialIcons name="info-outline" size={24} color={colorPrimary} />}
          label="Conta"
          onPress={() => navigation.navigate('MyInformation')}
        />
        <MenuItem
          icon={<MaterialCommunityIcons name="help-circle-outline" size={24} color={colorPrimary} />}
          label="Ajuda"
          onPress={() => navigation.navigate('Help')}
        />
        <MenuItem
          icon={<SimpleLineIcons name="pencil" size={24} color={colorPrimary} />}
          label="Sugestão"
          onPress={() => navigation.navigate('Feedback')}
        />
        <MenuItem
          icon={<MaterialCommunityIcons name="message-outline" size={24} color={colorPrimary} />}
          label="Consultoria"
          onPress={() => navigation.navigate('Consultancy')}
        />
        <MenuItem
          icon={<SimpleLineIcons name="logout" size={24} color="#D9534F" />}
          label="Sair da Conta"
          onPress={logOut}
        />
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconLabel}>
      {icon}
      <Text style={[styles.menuLabel, { color: label === "Sair da Conta" ? "#D9534F" : "#333" }]}>{label}</Text>
    </View>
    <MaterialIcons name="arrow-forward-ios" size={16} color={label === "Sair da Conta" ? "#D9534F" : colorPrimary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
  },
  menuContainer: {
    width: '100%',
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: height > 700 ? 16 :5 ,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: colorPrimary,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  menuIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 18,
    color: '#333',
  },
});

export default MyAccount;
