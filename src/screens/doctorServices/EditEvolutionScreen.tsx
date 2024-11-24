import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ScrollView } from 'react-native-gesture-handler';
import { api } from '../../config/Api';
import { background, colorPrimary } from '../../style/ColorPalette';
import KeyboardView from '../../components/KeyboardView';
import ErrorMessage from '../../components/errorMessage';
import LabelInput from '../../components/LabelInput';

const EditEvolutionScreen = ({ route, navigation }) => {
  const { evolution } = route.params;
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    comment: yup.string().required("Obrigatório")
  }).required();

  const { reset, handleSubmit, watch, formState: { errors }, control, setError, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      comment: evolution.comment,
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put(`/record/${evolution.rec_id}`, data);
      navigation.goBack();
      setLoading(false);
      reset();
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error?.response) {
        return setError("comment", { message: "Ocorreu um erro" });
      }
      return setError("comment", { message: "Sem conexão com a internet, tente novamente" });
    }
  };

  return (
    <KeyboardView style={styles.container}>
      <ScrollView style={styles.containerChildren}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.container2}>
              <LabelInput value='Comentário' />
              <TextInput
                style={{maxHeight:200, minHeight:200}}
                dense
                value={value}
                onChangeText={onChange}
                mode='outlined'
                multiline
                activeOutlineColor={colorPrimary}
              />
            </View>
          )}
          name='comment'
        />
        <ErrorMessage name={"comment"} errors={errors} />
        <View style={{ marginBottom: 40 }}>
          <Button
            icon="arrow-right"
            disabled={loading}
            loading={loading}
            buttonColor='#36B3B9'
            mode="contained"
            onPress={handleSubmit(onSubmit)}
          >
            Atualizar
          </Button>
        </View>
      </ScrollView>
    </KeyboardView>
  );
};

export default EditEvolutionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: background,
  },
  containerChildren: {
    flex: 1,
    backgroundColor: background,
    paddingVertical: 15,
    width: "90%"
  },
  container2: {
    backgroundColor: background,
    paddingVertical: 0,
  },
});
