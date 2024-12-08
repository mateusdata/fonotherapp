import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { zodResolver } from "@hookform/resolvers/zod"
import * as yup from "yup"
import { ScrollView } from 'react-native-gesture-handler';
import { cpf } from 'cpf-cnpj-validator';
import { useFocusEffect } from '@react-navigation/native';
import MaskInput, { Masks } from 'react-native-mask-input';
import dayjs from 'dayjs';

import { Context, useAuth } from '../../context/AuthProvider';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import { colorPrimary, colorSecundary } from '../../style/ColorPalette';
import { ContextGlobal, useGlobal } from '../../context/GlobalContext';
import LabelInput from '../../components/LabelInput';
import ErrorMessage from '../../components/errorMessage';
import { z } from "zod";



const CreatePacient = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useAuth();
  const { setPac_id, setPacient } = useContext(ContextPacient);
  const formatCpf = cpf;
  const { isDevelopment, setIsdevelopment } = useGlobal();
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
      // setValue("additional_information", "Informações adicionais");
    }

  }, []);
  const today = new Date();
  const twoYearsAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  const schema = z.object({
    name: z
      .string()
      .min(1, "Paciente é obrigatório") // Validação para campo não vazio
      .max(60, "Tamanho máximo excedido: 60 caracteres")
      .refine((value) => !/^\d+$/.test(value), {
        message: "Não são permitidas entradas numéricas",
      }),

    cpf: z
      .string()
      .min(1, "CPF obrigatório") // Validação para campo não vazio
      .regex(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/, "CPF inválido").transform((value) => {
        return value.replace(/\D/g, "");
      }),
    birthday: z
      .string()
      .min(1, "Obrigatório") // Validação para campo não vazio
      .transform((value) => {
        if (value) {
          const [day, month, year] = value.split("/");
          return `${year}-${month}-${day}`;
        }
        return value;
      })
      .refine(
        (value) => dayjs(value, "YYYY-MM-DD", true).isValid(),
        "Data inválida"
      )
      .refine(
        (value) => dayjs(value).isAfter(dayjs("1920-01-01")),
        "Data deve ser posterior a 01/01/1920"
      )
      .transform((value) => dayjs(value).format("YYYY-MM-DD")),

    last_name: z.string().optional(),
    additional_information: z
      .string()
      .max(100, "Tamanho máximo excedido: 100 caracteres")
      .nullable()
      .optional(),
  });




  const { reset, handleSubmit, watch, setValue, formState: { errors }, control, setError } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      name: "",
      last_name: ",",
      cpf: "",
      birthday: "",
      additional_information: ""
    }
  });


  const onSubmit = async (data) => {
    //return alert(JSON.stringify(data, null, 2))
    try {
      //comentar essa linha para não validar o cpf
      //  if (!cpf.isValid(data.cpf)) {
      //   setError("cpf", { message: "CPF inválido" });
      //   setLoading(false);
      //    return;
      // }


      setLoading(true);
      const response = await api.post("/pacient", { ...data, doc_id: user?.doctor?.doc_id });
      setPac_id(response.data.pac_id);
      setPacient(response?.data?.person);
      reset();
      navigation.navigate("Anamnese");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log((error.response.data.issues.find((issue) => issue.path[0] === "cpf")));
      if((error.response.data.issues.find((issue) => issue.path[0] === "cpf"))){
        setError("cpf", { message: "Paciente já existente no sistema" });
      }
      if((error.response.data.issues.find((issue) => issue.path[0] === "birthday"))){
        setError("birthday", { message: "Data inválida" });
      }
    
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
              keyboardType='numbers-and-punctuation'
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