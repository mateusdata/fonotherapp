import React, { useContext, useState } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { WelcomeNotification } from '../../utils/AgendaNotification';

import { api } from '../../config/Api';
import CustomText from '../../components/customText';
import LabelInput from '../../components/LabelInput';
import ErrorMessage from '../../components/errorMessage';
import { Context } from '../../context/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { styleGradient } from '../../style/styleGradient';
import { colorPrimary } from '../../style/ColorPalette';



const CreateAccount = ({ navigation }: any) => {

  const { setUser, setLoadingAuth } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    nick_name: yup
      .string()
      .required('Nick name é obrigatório'),

    email: yup
      .string()
      .transform(value => value.toLowerCase())
      .required('Obrigatório')
      .max(40, 'O tamanho máximo do texto é 40 caracteres')
      .email('Email inválido'),

    password: yup
      .string()
      .required('Obrigatório')
      .max(40, 'O tamanho máximo do texto é 40 caracteres')
      .min(5, 'Informe uma senha maior'),
  }).required();

  const { watch, reset, handleSubmit, setError, trigger, control, formState: { errors }, setValue } = useForm({
    defaultValues: {
      nick_name: "",
      password: "",
      email: ""
    },
  mode: "onSubmit",
    resolver: yupResolver(schema)

  });

  
  
  const onSubmit = async (data) => {

    try {
      setLoading(true)
      const response = await api.post("/user", data)
      setLoading(false);
      WelcomeNotification(`Olá, ${response?.data?.nick_name?.split(' ')[0]}! Seja bem-vindo à fonotherApp 🚀`, "Sua ferramenta completa para a fonoaudiologia.", 1);
      navigation.navigate("FinishRegistration", { user: watch() })
      reset();
    } catch (error) {
      if (error.response) {
        setError("password", { message: "Ocorreu um error" })
        return setLoading(false)

      }
      setError("password", { message: "sem conexão com a internet" })

      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          'hsla(320, 100%, 97%, 1)',
          'hsla(320, 100%, 99%, 1)',
          'hsla(320, 100%, 96%, 1)',
          'hsla(205, 100%, 95%, 1)',
          'hsla(313, 100%, 98%, 1)'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styleGradient.background}
      />
      <View style={styles.contentContainer}>
        <View style={{ gap: 10, marginTop: 10 }}>
          <CustomText fontFamily='Poppins_300Light' style={{
            fontSize: 25,
            marginBottom: 0,
            marginTop: 0,
            color: "#4d4d4f",
            textAlign: "center"
          }}>
            Criar conta
          </CustomText>

        </View>
        <View style={styles.inputContainer}>

          <LabelInput value='Nome' />
          <Controller control={control}
            render={({ field: { onChange, onBlur, value, } }) => (
              <TextInput
                dense
                testID='name'
                mode="outlined"
                autoFocus
                activeOutlineColor={colorPrimary}
                error={!!errors.nick_name}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}

            name="nick_name"
          />

          <ErrorMessage name={"nick_name"} errors={errors} />

          <LabelInput value='Email' />
          <Controller control={control}
            render={({ field: { onChange, onBlur, value, } }) => (
              <TextInput
                dense
                testID='email'
                mode="outlined"
                activeOutlineColor={colorPrimary}
                error={!!errors.email}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}

            name="email"
          />

          <ErrorMessage name={"email"} errors={errors} />

          <LabelInput value='Senha' />
          <Controller control={control} rules={
            {
              required: 'Obrigatório', maxLength: { value: 40, message: "Nome muito grande" },
              minLength: { value: 5, message: "Informe uma senha maior" },
            }}
            render={({ field: { onChange, onBlur, value, } }) => (
              <TextInput
                dense
                testID='password'
                mode="outlined"
                activeOutlineColor={colorPrimary}
                error={!!errors.password}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
            name="password"
          />

          <ErrorMessage name={"password"} errors={errors} />

          <Button
            testID='create-account'
            disabled={loading}
            loading={loading}
            buttonColor='#36B3B1'
            textColor='white'
            style={styles.button}
            onPress={handleSubmit(onSubmit)}>
            Criar conta
          </Button>


          <View>
         
          </View>
        </View>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Fazer login</Text>
          </Pressable>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {

    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    gap: 15,
    alignItems: "center",
  },
  button: {
    padding: 5
  },
  buttonGoogle: {
    padding: 5,
    top: 15
  },
  titleText: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 25,
    marginBottom: 0,
    marginTop: 0,
    color: "#4d4d4f",
  },
  inputContainer: {
    width: "90%",
    gap: 0,
    flex: 1,
  },
  footerContainer: {
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  footerText: {
    fontFamily: "Poppins_600SemiBold",
    color: "gray",
  },
  linkText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#407AFF",
  },
});

export default CreateAccount;
