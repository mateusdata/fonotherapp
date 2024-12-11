import React, { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthProvider';
import { colorPrimary, colorRed } from '../../constants/ColorPalette';
import { height } from '../../utils/widthScreen';

const MyInformation = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Adicione aqui o componente de upload de avatar ou qualquer outra coisa que faça parte do header */}
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon={<Ionicons name="create-outline" size={28} color={colorPrimary} />}
          label="Nome de usuário"
          onPress={() => navigation.navigate("ChangeName")}
        />
        <MenuItem
          icon={<Ionicons name="at" size={28} color={colorPrimary} />}
          label="Email"
          onPress={() => navigation.navigate("ChangeEmail")}
        />
        <MenuItem
          icon={<Ionicons name="settings-outline" size={28} color={colorPrimary} />}
          label="Senha"
          onPress={() => navigation.navigate("ChangeCredential")}
        />
        <MenuItem
          icon={<Ionicons name="id-card-outline" size={28} color={colorPrimary} />}
          label="CRFA"
          onPress={() => navigation.navigate("ChangeGovLicense")}
        />
        <MenuItem
          icon={<Ionicons name="phone-portrait-outline" size={28} color={colorPrimary} />}
          label="Telefone"
          onPress={() => navigation.navigate("ChangePhone")}
        />
        <MenuItem
          icon={<Ionicons name="trash-outline" size={28} color={colorRed} />}
          label="Apagar conta"
          onPress={() => navigation.navigate("DeleteAccount")}
        />
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <Pressable style={styles.menuItem} onPress={onPress} android_ripple={{ color: colorPrimary }}>
    <View style={styles.menuIconLabel}>
      {icon}
      <Text style={[styles.menuLabel, { color: label === "Apagar conta" && colorRed }]}>{label}</Text>
    </View>
    <MaterialIcons name="arrow-forward-ios" size={18} color={label === "Apagar conta" ? colorRed : colorPrimary} />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
  },
  menuContainer: {
    width: '100%',
    marginTop: 14,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: height > 700 ? 16 : 5,
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
    flexShrink: 1,
  },
});

export default MyInformation;
