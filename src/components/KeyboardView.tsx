import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

// Componente simplificado com nome curto
const KeyboardView = ({ children, style, ...props }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KeyboardView;
