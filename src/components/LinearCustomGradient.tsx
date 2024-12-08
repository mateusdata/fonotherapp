import React from 'react';
import { LinearGradient } from 'expo-linear-gradient'; 
import { StyleSheet } from 'react-native';
import { styleGradient } from '../constants/styleGradient';

const LinearCustomGradient = () => {
  return (
    <LinearGradient
      colors={[
        'hsla(320, 100%, 95%, 1)',
        'hsla(320, 100%, 99%, 1)',
        'hsla(210, 100%, 97%, 1)',
        'hsla(205, 100%, 95%, 1)',
        'hsla(313, 100%, 98%, 1)'
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styleGradient.background}
    />
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

export default LinearCustomGradient;
