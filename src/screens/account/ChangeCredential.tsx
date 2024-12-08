import * as React from 'react';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../context/AuthProvider';
import { api } from '../../config/Api';
import LabelInput from '../../components/LabelInput';
import ErrorMessage from '../../components/errorMessage';
import { colorPrimary } from '../../constants/ColorPalette';
import { showToast } from '../../utils/showToast';

export default function ChangeCredential() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = React.useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = React.useState(false);

  const schema = yup.object({
    new_password: yup.string().min(3, "Nova senha é muito pequena"),
    current_password: yup.string().min(6, "Senha atual é muito pequena")
  });

  const { control, watch, handleSubmit, setError, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      new_password: "",
      current_password: ""
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await api.post(`/password`, data);
      setLoading(false);

      showToast({
        type: "success",
        text1: "Senha atualizada",
        position: "bottom"
      });

      reset();
    } catch (error) {
      setLoading(false);
      setError("new_password", { message: "Ocorreu um erro" });
      setError("current_password", { message: "" });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.9 }}>
        <LabelInput value='Senha atual' />
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              dense
              secureTextEntry={!currentPasswordVisible}
              error={!!errors.current_password}
              onChangeText={onChange}
              mode="outlined"
              activeOutlineColor={errors?.current_password ? 'red' : colorPrimary}
              value={value}
              right={
                watch("current_password") && (
                  <TextInput.Icon
                    icon={currentPasswordVisible ? "eye-off" : "eye"}
                    onPress={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                  />
                )
              }
            />
          )}
          name='current_password'
        />
        <ErrorMessage name={"current_password"} errors={errors} />

        <LabelInput value='Nova senha' />
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              dense
              secureTextEntry={!newPasswordVisible}
              error={!!errors.new_password}
              onChangeText={onChange}
              mode="outlined"
              activeOutlineColor={errors?.new_password ? 'red' : colorPrimary}
              value={value}
              right={
                watch("new_password") && (
                  <TextInput.Icon
                    icon={newPasswordVisible ? "eye-off" : "eye"}
                    onPress={() => setNewPasswordVisible(!newPasswordVisible)}
                  />
                )
              }
            />
          )}
          name='new_password'
        />
        <ErrorMessage name={"new_password"} errors={errors} />
      </View>

      <Button
        loading={loading}
        buttonColor='#36B3B1'
        textColor='white'
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        Alterar senha
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
  button: {
    padding: 5
  }
});
