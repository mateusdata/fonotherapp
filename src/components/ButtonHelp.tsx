import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function ButtonHelp({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons name="help-outline" size={27} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#36B3B9', 
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    right:8,
  },
});
