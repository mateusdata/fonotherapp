import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function LabelInput({ value, ...props }) {
  return (
    <Text
      style={styles.custonText}
      {...props} 
    >
      {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  custonText: {
    paddingHorizontal: 3,
    paddingVertical: 0,
    fontSize: 18,
    color: "black",
    marginBottom: 8
  }
});
