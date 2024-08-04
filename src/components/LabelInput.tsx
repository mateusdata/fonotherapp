import React from 'react'
import { StyleSheet, Text } from 'react-native'
import CustomText from './customText'

export default function LabelInput({ value }: { value: string }) {

  return (
    <Text
      style={style.custonText}>
      {value}
    </Text>
  )
}

const style = StyleSheet.create({
  custonText: {
    paddingHorizontal: 3,
    paddingVertical: 0,
    fontSize: 18,
    color: "black",
    marginBottom:8
  }
})