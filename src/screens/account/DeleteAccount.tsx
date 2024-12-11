import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { colorPrimary, colorRed } from '../../constants/ColorPalette'
import LabelInput from '../../components/LabelInput'
import { api } from '../../config/Api'
import { useAuth } from '../../context/AuthProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function DeleteAccount() {
  const [password, setPassword] = useState('')
  const { user, logOut } = useAuth()

  const handleDeleteAccount = async () => {
    try {
      const response = await api.delete("/user")
      alert('Conta deletada com sucesso!')
      setTimeout(async () => {
        await AsyncStorage.clear()
        logOut()
      }, 2000)
    } catch (error) {
      Alert.alert('Erro ao deletar conta, por favor tente novamente.')
    }
  }

  const handleLogin = async () => {
    // Verifique a senha aqui e execute a lógica de deletar conta
    if (!password) {
      return
    }
    const formatUser = {
      email: user?.email,
      password: password
    }
    try {
      const response = await api.post('/login', formatUser)
      handleDeleteAccount()
    } catch (error) {
      Alert.alert('Senha incorreta, por favor tente novamente.')
    }
  }


  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.warning}>
          Apagar sua conta vai:
          {'\n'}- Apagar seus dados de conta e foto do perfil.
          {'\n'}- Apagar todos os seus pacientes do FonotherApp.
          {'\n'}- Apagar todos os dados de atendimentos.
          {'\n'}- Apagar qualquer registro criado por você.
        </Text>

        <LabelInput value={"Confirmar sua senha"} />
        <TextInput
          dense
          mode='outlined'
          activeOutlineColor={colorPrimary}
          placeholder="Confirme sua senha"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button textColor='white' buttonColor={colorRed} onPress={handleLogin} >
        Deletar Conta
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    gap: 15
  },
  warning: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
})
