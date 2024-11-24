import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { cpf } from 'cpf-cnpj-validator';
import { useFocusEffect } from '@react-navigation/native';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import LabelInput from '../../components/LabelInput';
import SkelectonView from '../../components/SkelectonView';
import MaskInput, { Masks } from 'react-native-mask-input';
import { colorPrimary, colorSecundary } from '../../style/ColorPalette';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from '../../components/errorMessage';
import dayjs from 'dayjs';
import { vibrateFeedback } from '../../utils/vibrateFeedback';

const schema = yup.object({
  first_name: yup.string().required('O nome é obrigatório'),
  cpf: yup.string().optional(),
  additionalInformation: yup.string().optional(),
  birthday: yup
    .string()
    .transform((value, originalValue) => {
      if (originalValue) {
        const [day, month, year] = originalValue.split('/');
        return `${year}-${month}-${day}`;
      }
      return originalValue;
    })
    .test('is-date', 'Data inválida', value => dayjs(value, 'YYYY-MM-DD', true).isValid())
    .transform((value) => dayjs(value).format('YYYY-MM-DD'))
    .required("Obrigatório"),
});

const PatientUpdate = ({ navigation }) => {
  const { pac_id } = useContext(ContextPacient);
  const [pacient, setPacient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const { control, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      cpf: '',
      birthday: '',
      additionalInformation:''
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/pacient/${pac_id}`);
        const { first_name, person } = response.data;
        setPacient(response.data);

        const formattedBirthday = dayjs(person.birthday).format('DD/MM/YYYY');

        setValue('first_name', first_name);
        setValue('cpf', cpf.format(person.cpf));
        setValue('birthday', formattedBirthday);
      } catch (error) {
        console.error('Erro ao buscar os dados do paciente:', error);
      }
    };
    fetchData();
  }, [pac_id, setValue]);


  const handleUpdatePatient = async (data) => {
    setLoading(true);

    try {

      const formattedData = {
        first_name: data.first_name,
        birthday: formatDateToISO(data.birthday),
      };

      const response = await api.put(`/pacient/${pac_id}`, formattedData);
      vibrateFeedback()
      Alert.alert("Paciente", 'atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao atualizar paciente', 'Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };


  const formatDateToISO = (date) => {

    const [day, month, year] = date.split('/');
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }


    return date;
  };

  if (!pacient) {
    return <SkelectonView />;
  }

  return (
    <ScrollView style={styles.container}>
      <LabelInput value="Nome" />
      <Controller
        control={control}
        name="first_name"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              mode="outlined"
              activeOutlineColor={colorPrimary}
              value={value}
              onChangeText={onChange}
              style={styles.input}
              error={!!error}
            />
            <ErrorMessage name={"first_name"} errors={errors} />
          </>
        )}
      />

      <LabelInput value="CPF" />
      <Controller
        control={control}
        name="cpf"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              mode="outlined"
              activeOutlineColor={colorPrimary}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              style={styles.input}
              error={!!error}
              disabled
            />
          </>
        )}
      />

      <LabelInput value='Informações Adicionais' />
      <Controller control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            dense
            value={value}
            onChangeText={onChange}
            mode='outlined'
            activeOutlineColor={colorPrimary} />
        )}
        name='additionalInformation'
      />
      <ErrorMessage name={"additionalInformation"} errors={errors} />
      <View style={{ top: 15 }}>
        <LabelInput value="Data de Nascimento" />
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <MaskInput
              style={[
                styles.maskInput,
                {
                  backgroundColor: "#f9f7fc",
                  borderColor: isFocus ? colorPrimary : "#848484",
                  borderWidth: isFocus ? 2 : 1,
                },
              ]}
              value={value}
              placeholder={null}
              cursorColor={colorSecundary}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChangeText={(masked) => {
                onChange(masked);
              }}
              mask={Masks.DATE_DDMMYYYY}
            />
          )}
          name="birthday"
        />
      </View>

      <Button
        style={{ top: 24 }}
        textColor="white"
        buttonColor={colorPrimary}
        onPress={handleSubmit(handleUpdatePatient)}
        disabled={loading}
      >
        {loading ? 'Atualizando...' : 'Atualizar Paciente'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
  },
  maskInput: {
    padding: 17,
    borderRadius: 4,
    backgroundColor: '#fff9f9',
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default PatientUpdate;
