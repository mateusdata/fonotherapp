import * as React from 'react';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { View, StyleSheet, Keyboard, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../config/Api';
import LabelInput from '../../components/LabelInput';
import ErrorMessage from '../../components/errorMessage';
import { colorPrimary } from '../../style/ColorPalette';
import { getUser } from '../../utils/getUser';
import { useAuth } from '../../context/AuthProvider';
import { showToast } from '../../utils/showToast';


export default function ChangeName() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  Keyboard.isVisible()
  const schema = yup.object({
    name: yup.string().min(3, "Nome muito pequeno").required("Obrigatorio").matches(/^(?!^\d+$).+$/, { message: "Números não sãoo permitidos" })
  })
  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      name: user?.person.name
    }
  })
  const onSubmit = async (data: any) => {
    setLoading(true);
    api.put(`/person/${user?.person.per_id}`, data).then(async (response) => {
      showToast({
        type: "success",
        text1: "Nome atualizado",
        position: "bottom"
      }); try {
        await getUser(setUser)
      } catch (error) {
      }
      setLoading(false);

    }).catch((e) => {
      setLoading(false);
      setError("name", { message: "Ocorreu um erro" })


    });
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.9 }}>

        <LabelInput value='Alterar nome' />
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput

              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              activeOutlineColor={colorPrimary}
              value={value}
            />
          )}
          name='name'
        />
        <ErrorMessage name={"name"} errors={errors} />
        <Button

          loading={loading}
          buttonColor='#36B3B1'
          textColor='white'
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          Alterar nome
        </Button>
      </View>



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
