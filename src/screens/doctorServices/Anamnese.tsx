import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ScrollView } from 'react-native-gesture-handler';
import { cpf } from 'cpf-cnpj-validator';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Context } from '../../context/AuthProvider';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import { background, colorGray, colorPrimary, colorRed } from '../../style/ColorPalette';
import { ContextGlobal } from '../../context/GlobalContext';
import LabelInput from '../../components/LabelInput';
import ErrorMessage from '../../components/errorMessage';
import KeyboardView from '../../components/KeyboardView';
import { FormatPacient } from '../../interfaces/globalInterface';


interface FormatAnamnese {
  navigation?: any,
  pacient: FormatPacient,
  setShowToast: Function
}
const data = [
  { label: 'Via oral exclusiva', value: 'Via oral exclusiva' },
  { label: 'Via alternativa de longa permanência exclusiva (ex: gastrostomia, jejunostomia)', value: 'Via alternativa de longa permanência exclusiva (ex: gastrostomia, jejunostomia)' },
  { label: 'Via alternativa provisória (Sonda Oro/Nasoenteral ou gástrica)', value: 'Via alternativa provisória (Sonda Oro/Nasoenteral ou gástrica)' },
  { label: 'Via parenteral exclusiva', value: 'Via parenteral exclusiva' },
  { label: 'Via mista (Via oral+ via alternativa de alimentação)', value: 'Via mista (Via oral+ via alternativa de alimentação)' },
  { label: 'Dieta zero', value: 'Dieta zero' }
];

const educationLevels = [
  { label: 'Educação Infantil', value: 'Educação Infantil' },
  { label: 'Ensino Fundamental I', value: 'Ensino Fundamental I' },
  { label: 'Ensino Fundamental II', value: 'Ensino Fundamental II' },
  { label: 'Ensino Médio', value: 'Ensino Médio' },
  { label: 'Ensino Superior', value: 'Ensino Superior' },
  { label: 'Pós-Graduação', value: 'Pós-Graduação' },
  { label: 'Mestrado', value: 'Mestrado' },
  { label: 'Doutorado', value: 'Doutorado' }
];



const Anamnese = ({ navigation, pacient, setShowToast }: FormatAnamnese) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { setPac_id, setPacient, pac_id } = useContext(ContextPacient);
  const { isDevelopment, setIsdevelopment } = useContext(ContextGlobal)
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusEducation, setIsFocusEducation] = useState(false);

  const schema = yup.object({
    education: yup.string().optional(),
    base_diseases: yup.string().required("Obrigatorio"),
    food_profile: yup.string().required("Obrigatorio"),
    chewing_complaint: yup.string().required("Obrigatorio"),
    consultation_reason: yup.string().required("Obrigatorio"),
    current_food_intake_method: yup.string().optional(),

  }).required();

  const { reset, handleSubmit, watch, formState: { errors }, control, setError } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      education: pacient ? pacient?.education : "",
      base_diseases: pacient ? pacient?.base_diseases  : "",
      chewing_complaint: pacient ? pacient?.chewing_complaint :  "",
      consultation_reason: pacient ? pacient?.consultation_reason : "",
      food_profile: pacient ? pacient?.food_profile : "",
      current_food_intake_method: pacient ? pacient?.current_food_intake_method : "",
    }
  });
  

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.put(`/pacient/${pac_id}`, data);
      setPac_id(response.data.pac_id);
      setPacient(response?.data?.person);
      if (pacient) {
        setShowToast(true)
        setLoading(false);
      }
      navigation.navigate("PatientAnalysis");
      setLoading(false);
      reset();
    } catch (error) {
      setLoading(false);
     
      if (!error?.response) {
       // return setError("chewing_complaint", { message: "Sem conexão com a internet, tente novamente" })
      }

    }
  };

  return (
    <KeyboardView style={styles.container}>
      <ScrollView style={styles.containerChildren}>

        <Controller control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.container2}>
              <LabelInput value='Escolaridade' />
              <Dropdown
                style={[styles.dropdown, isFocusEducation && { borderColor: colorPrimary, borderWidth: 2 }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={educationLevels}
                search={false}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocusEducation ? 'Selecione' : 'Selecione'}
                searchPlaceholder="SearchSelecione"
                value={value}
                onFocus={() => setIsFocusEducation(true)}
                onBlur={() => setIsFocusEducation(false)}
                onChange={item => {
                  onChange(item.value)
                  setIsFocusEducation(false);
                }}

              />
            </View>
          )}
          name='education'
        />
        <ErrorMessage name={"education"} errors={errors} />
        <Controller control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.container2}>

              <LabelInput value='Via de alimentação atual' />
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: colorPrimary, borderWidth: 2 }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search={false}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Selecione' : 'Selecione'}
                searchPlaceholder="SearchSelecione"
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  onChange(item.value)
                  setIsFocus(false);
                }}

              />
            </View>
          )}
          name='current_food_intake_method'
        />
        <ErrorMessage name={"current_food_intake_method"} errors={errors} />

        <LabelInput value='Doença base' />
        <Controller control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              dense
              value={value}
              onChangeText={onChange}
              mode='outlined'
              activeOutlineColor={colorPrimary} />
          )}
          name='base_diseases'
        />
        <ErrorMessage name={"base_diseases"} errors={errors} />

        <LabelInput value='Histórico alimentar' />
        <Controller control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              dense
              value={value}
              onChangeText={onChange}
              mode='outlined'
              activeOutlineColor={colorPrimary} />
          )}
          name='food_profile'
        />
        <ErrorMessage name={"food_profile"} errors={errors} />

        {
          false &&
          <>
            <LabelInput value='Queixas de deglutição' />
            <Controller control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  dense
                  value={value}
                  onChangeText={onChange}
                  mode='outlined'
                  activeOutlineColor={colorPrimary} />
              )}
              name='chewing_complaint'
            />
            <ErrorMessage name={"chewing_complaint"} errors={errors} />
          </>
        }

        <LabelInput value='Motivo da consulta' />
        <Controller control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              dense
              value={value}
              onChangeText={onChange}
              mode='outlined'
              activeOutlineColor={colorPrimary} />
          )}
          name='consultation_reason'
        />
        <ErrorMessage name={"consultation_reason"} errors={errors} />


        <LabelInput value='Queixas de deglutição' />
        <Controller control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              dense
              value={value}
              onChangeText={onChange}
              mode='outlined'
              activeOutlineColor={colorPrimary} />
          )}
          name='chewing_complaint'
        />
        <ErrorMessage name={"chewing_complaint"} errors={errors} />


        <View style={{ marginBottom: 40 }}>

          <Button icon="arrow-right"
            disabled={loading} loading={loading} buttonColor='#36B3B9' mode="contained" onPress={handleSubmit(onSubmit)}>
            {pacient ? "Atualizar" : "   Próximo"}
          </Button>

        </View>

      </ScrollView>


    </KeyboardView >
  );
};


export default Anamnese;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: background,
  },
  containerChildren: {
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
    backgroundColor: background,
    paddingVertical: 15,
    width: "90%"
  },

  button: {
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },

  container2: {
    backgroundColor: background,
    paddingVertical: 0,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "white"

  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: background,
    left: 10,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: colorGray

  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 7,
    color: "gray"
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
