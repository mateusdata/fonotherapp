import * as React from 'react';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { View, StyleSheet, Keyboard, Text } from 'react-native';
import { Context } from '../context/AuthProvider';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import ErrorMessage from '../components/errorMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api }  from '../config/Api';
import LabelInput from '../components/LabelInput';
export default function ChangeName() {
  const { user, setUser } = React.useContext(Context);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showToast, setShowToast] = React.useState<boolean>(false)
  Keyboard.isVisible()
  const schema = yup.object({
    nick_name: yup.string().min(3, "Nome muito pequeno").required("Obrigatorio").matches(/^(?!^\d+$).+$/, { message: "Números não sãoo permitidos" })
  })
  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      nick_name: user?.nick_name
    }
  })
  const onSubmit = (data: string) => {
    setLoading(true);
    api.put(`/user/${user?.usu_id}`, data).then(async (response) => {
      setShowToast(true);
      try {
        const recoveryUser = JSON.parse(await AsyncStorage.getItem("usuario"));
        const updatedUser = { ...recoveryUser, ...response.data };
        setUser(updatedUser);
        await AsyncStorage.setItem("usuario", JSON.stringify(updatedUser));
      } catch (error) {
      }
      setLoading(false);

    }).catch((e) => {
      setLoading(false);
      setError("nick_name", { message: "Ocorreu um erro" })
      console.log(e);
      
    });
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.9 }}>

      <LabelInput value='Aterar nome' />
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              autoFocus
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              activeOutlineColor='#376fe8'
              value={value}
            />
          )}
          name='nick_name'
        />
        <ErrorMessage name={"nick_name"} errors={errors} />
        <Snackbar onDismiss={() => { setShowToast(!showToast) }}
          duration={2000}
          visible={showToast}
          action={{ label: "Fechar" }}
        >
          Nome Atualizado
        </Snackbar>
      </View>

      <Button

        loading={loading}
        buttonColor='#36B3B1'
        textColor='white'
        style={styles.button}
        onPress={handleSubmit(onSubmit)}>
        Alterar nome
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 8,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    padding: 5
  }
});
