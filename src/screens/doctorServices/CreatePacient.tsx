import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ScrollView } from 'react-native-gesture-handler';
import { cpf } from 'cpf-cnpj-validator';
import { useFocusEffect } from '@react-navigation/native';
import MaskInput, { Masks } from 'react-native-mask-input';
import dayjs from 'dayjs';

import { Context } from '../../context/AuthProvider';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import { colorPrimary, colorSecundary } from '../../style/ColorPalette';
import { ContextGlobal } from '../../context/GlobalContext';
import LabelInput from '../../components/LabelInput';
import ErrorMessage from '../../components/errorMessage';



const CreatePacient = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useContext(Context);
  const { setPac_id, setPacient } = useContext(ContextPacient);
  const formatCpf = cpf;
  const { isDevelopment, setIsdevelopment } = useContext(ContextGlobal)
  const [isFocus, setIsFocus] = useState(false);


  useEffect(() => {
    let cpf = "";
    const names = [
      "João Santos ",
      "Maria Ferreira",
      "Pedro Alves Cabral",
      "Ana Santana",
      "Carlos Santos",
      "Julia Santos",
      "Fernando Bragança",
      "Luisa sonça",
      "Mariana Silva",
      "Rafael Boaventura"
    ];
    while (cpf.length < 11) {
      cpf += Math.floor(Math.random() * 10);
    }
    if (isDevelopment) {
      setValue("cpf", cpf);
      setValue("name", names[Math.floor(Math.random() * names.length)]);
      setValue("birthday", "20/10/1998");
      setValue("additional_information", "Informações adicionais");
    }

  }, []);
  const today = new Date();
  const twoYearsAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());



  const schema = yup.object({
    name: yup
      .string()
      .required("Paciente é obrigatório")
      .matches(/^(?!^\d+$).+$/, {
        message: 'Não são permitidas entradas numéricas'
      }),

    cpf: yup
      .string()
      .matches(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/, {
        message: "CPF inválido",
        excludeEmptyString: false
      })
      .required("CPF obrigatório"),

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

    last_name: yup.string(),
    additional_information: yup.string().optional()
  }).required();

  const { reset, handleSubmit, watch, setValue, formState: { errors }, control, setError } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      name: "",
      last_name: ",",
      cpf: "",
      birthday: "",
      additional_information: ""
    }
  });


  const onSubmit = async (data) => {

    try {
      /*
      if (!cpf.isValid(data.cpf)) {
        setError("cpf", { message: "CPF inválido" });
        setLoading(false);
        return;
      }*/

      setLoading(true);
      const response = await api.post("/pacient", { ...data, doc_id: user?.doctor?.doc_id });
      setPac_id(response.data.pac_id);
      setPacient(response?.data?.person);
      reset();
      navigation.navigate("Anamnese");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("additional_information", { message: "Ocorreu um erro" });
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.containerChildren}>

        <LabelInput value='Nome' />
        <Controller control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              mode='outlined'
              dense
              activeOutlineColor={colorPrimary} />
          )}
          name='name'
        />

        <ErrorMessage name={"name"} errors={errors} />

        <LabelInput value='CPF' />
        <Controller control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={formatCpf.format(value)}
              onChangeText={onChange}
              mode='outlined'
              dense
              activeOutlineColor={colorPrimary} />
          )}
          name='cpf'
        />
        <ErrorMessage name={"cpf"} errors={errors} />

        <LabelInput value='Data de nascimento' />
        <Controller control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <MaskInput
              style={[styles.maskInput, { backgroundColor: "#f9f7fc", borderColor: isFocus ? colorPrimary : "#848484", borderWidth: isFocus ? 2 : 1 }]}
              value={(value)}
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

          name='birthday'
        />
        <ErrorMessage name={"birthday"} errors={errors} />

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
          name='additional_information'
        />
        <ErrorMessage name={"additional_information"} errors={errors} />


        <View style={{ marginBottom: 40 }}>

          <Button icon="arrow-right"
            disabled={loading} loading={loading} buttonColor='#36B3B9' mode="contained" onPress={handleSubmit(onSubmit)}>
            Próximo
          </Button>
          
        </View>

      </ScrollView>



    </View>
  );
};


export default CreatePacient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  containerChildren: {
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    width: "100%"
  },

  button: {
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  maskInput: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "transparent",
    fontSize: 16
  }
});


/*
import React from 'react';
import MaskInput, { Masks } from 'react-native-mask-input';
import { colorSecundary } from '../style/ColorPalette';

export default function MyComponent() {
  const [phone, setPhone] = React.useState('');

  return (
    <MaskInput
      style={{borderWidth:2, borderColor:colorSecundary, padding:10}}
      value={phone}
      placeholder='Data de nascimento'
      cursorColor={"gray"}
      onChangeText={(masked, unmasked) => {
        setPhone(masked); // you can use the unmasked value as well
      }}
      mask={Masks.DATE_DDMMYYYY}
    />
  );
}

*/