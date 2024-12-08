import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { cpf } from 'cpf-cnpj-validator';
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
import { FormatPacient } from '../../interfaces/globalInterface';
import { showToast } from '../../utils/showToast';
import Toast from 'react-native-toast-message';

const schema = yup.object({
  name: yup.string().max(60, "Tamanho máximo excedido: 60 caracteres").required('O nome é obrigatório'),
  cpf: yup.string().optional(),
  additional_information: yup.string().nullable().optional(),
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
  const [pacient, setPacient] = useState<FormatPacient>(null);
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      cpf: '',
      birthday: '',
      additional_information: ''
    },
  });

  const fetchData = async () => {
    try {
      const response = await api.get(`/pacient/${pac_id}`);
      const { name, person, additional_information }: FormatPacient = response.data;
      setPacient(response.data);
      const formattedBirthday = dayjs(person.birthday).format('DD/MM/YYYY');

      setValue('name', name);
      setValue('cpf', cpf.format(person.cpf));
      setValue('birthday', formattedBirthday);
      setValue('additional_information', additional_information);
    } catch (error) {
      console.error('Erro ao buscar os dados do paciente:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pac_id, setValue]);

  const handleUpdatePatient = async (data) => {
    setLoading(true);

    try {
      const formattedData = {
        name: data.name,
        birthday: formatDateToISO(data.birthday),
        additional_information: data.additional_information
      };

      await api.put(`/pacient/${pac_id}`, formattedData);
      fetchData();
      setLoading(false);
      vibrateFeedback();
      showToast({
        type: "success",
        text1: "Paciente atualizado",
        position: "bottom"
      });

      
    } catch (error) {

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
        name="name"
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
            <ErrorMessage name={"name"} errors={errors} />
          </>
        )}
      />

      <LabelInput value="CPF" />
      <Controller
        control={control}
        name="cpf"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
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
        )}
      />

      <LabelInput value='Informações Adicionais' />
      <Controller
        control={control}
        name="additional_information"
        render={({ field: { onChange, value } }) => (
          <TextInput
            dense
            value={value}
            onChangeText={onChange}
            mode='outlined'
            activeOutlineColor={colorPrimary}
            style={styles.input}
          />
        )}
      />
      <ErrorMessage name={"additional_information"} errors={errors} />

      <View style={{ top: 15 }}>
        <LabelInput value="Data de Nascimento" />
        <Controller
          control={control}
          name="birthday"
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
              onChangeText={(masked) => onChange(masked)}
              mask={Masks.DATE_DDMMYYYY}
            />
          )}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button
          textColor="white"
          buttonColor={colorPrimary}
          onPress={handleSubmit(handleUpdatePatient)}
          disabled={loading}
          loading={loading}
        >
          Atualizar Paciente
        </Button>
      </View>
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
