import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons, SimpleLineIcons, MaterialCommunityIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../../context/AuthProvider';
import { colorPrimary, colorRed } from '../../style/ColorPalette';
import UploadAvatar from '../../components/UploadAvatar';

const MyAccount = ({ navigation }) => {
  const { logOut, user } = useContext(Context);
  const [google, setGoogle] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await AsyncStorage.getItem('google');
      setGoogle(JSON.parse(response));
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
    

      <View style={styles.header}>
       <UploadAvatar user={user}/>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon={<MaterialIcons name="info-outline" size={23} color={colorPrimary} />}
          label="Conta"
          onPress={() => navigation.navigate('MyInformation')}
        />
        <MenuItem
          icon={<MaterialCommunityIcons name="help-circle-outline" size={23} color={colorPrimary} />}
          label="Ajuda"
          onPress={() => navigation.navigate('Help')}
        />
        <MenuItem
          icon={<SimpleLineIcons name="pencil" size={23} color={colorPrimary} />}
          label="Sugestão"
          onPress={() => navigation.navigate('Feedback')}
        />

        <MenuItem
          icon={<MaterialCommunityIcons name="message-outline" size={23} color={colorPrimary} />}
          label="Consultoria"
          onPress={() => navigation.navigate('Consultancy')}
        />
        <MenuItem
          icon={<SimpleLineIcons name="logout" size={23} color={colorRed} />}
          label="Sair da Conta"
          onPress={logOut}
        />
      </View>
    </View>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconLabel}>
      {icon}
      <Text style={[styles.menuLabel, {color:label === "Sair da Conta" ? colorRed : "black"}]}>{label}</Text>
    </View>
    <MaterialIcons name="arrow-forward-ios" size={15} color={label === "Sair da Conta" ? colorRed : colorPrimary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  menuContainer: {
    width: '100%',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  menuIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuLabel: {
    fontSize: 18,
    color: '#474747',
  },
});

export default MyAccount;
