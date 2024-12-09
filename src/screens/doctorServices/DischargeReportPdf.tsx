import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../context/AuthProvider';
import { api } from '../../config/Api';
import { colorPrimary } from '../../constants/ColorPalette';
import ErrorMessage from '../../components/errorMessage';
import LabelInput from '../../components/LabelInput';
import KeyboardView from '../../components/KeyboardView';
import downloadPDF from '../../utils/downloadPDF';

const DischargeReportPdf = ({ route }) => {
  const { pacient } = route.params;
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    medical_diagnoses: yup.string().max(300, "Valor máximo excedido: 300 caracteres").required("Campo obrigatório"),
    how_it_was_discovered: yup.string().max(300, "Valor máximo excedido: 300 caracteres").required("Campo obrigatório"),
    first_session_findings: yup.string().max(300, "Valor máximo excedido: 300 caracteres").required("Campo obrigatório"),
    therapeutic_plan: yup.string().max(300, "Valor máximo excedido: 300 caracteres").required("Campo obrigatório"),
    patients_progress: yup.string().max(300, "Valor máximo excedido: 300 caracteres").required("Campo obrigatório"),
    referrals: yup.string().max(300, "Valor máximo excedido: 300 caracteres").required("Campo obrigatório"),
  });
  
  const { control, formState: { errors }, reset, handleSubmit } = useForm({
    defaultValues: {
      medical_diagnoses: "",
      how_it_was_discovered: "",
      first_session_findings: "",
      therapeutic_plan: "",
      patients_progress: "",
      referrals: "",
    },
    resolver: yupResolver(schema)
  });

  async function getPdf(values) {
    try {
      const response = await api.post(`/discharg-report/${pacient?.pac_id}`, values);
      await downloadPDF(response.data.doc_url, response.data.doc_name, accessToken, setLoading);
      reset();
    } catch (error) {
      console.error("Ocorreu um erro", error);
      alert("Erro ao gerar pdf");
    }
  }

  return (
    <KeyboardView>
      <ScrollView  keyboardShouldPersistTaps="handled" style={{ padding: 20 }}>
        

        <View>
          <LabelInput value="Diagnóstico(s)" />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                activeOutlineColor={colorPrimary}
                dense
                mode="outlined"
                value={value}
                onChangeText={onChange}
              />
            )}
            name="medical_diagnoses"
          />
          <ErrorMessage errors={errors} name="medical_diagnoses" />

          <LabelInput value="História Clínica" />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                activeOutlineColor={colorPrimary}
                dense
                mode="outlined"
                value={value}
                onChangeText={onChange}
              />
            )}
            name="how_it_was_discovered"
          />
          <ErrorMessage errors={errors} name="how_it_was_discovered" />

          <LabelInput value="Avaliação Inicial" />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                activeOutlineColor={colorPrimary}
                dense
                mode="outlined"
                value={value}
                onChangeText={onChange}
              />
            )}
            name="first_session_findings"
          />
          <ErrorMessage errors={errors} name="first_session_findings" />

          <LabelInput value="Plano Terapêutico" />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                activeOutlineColor={colorPrimary}
                dense
                mode="outlined"
                value={value}
                onChangeText={onChange}
              />
            )}
            name="therapeutic_plan"
          />
          <ErrorMessage errors={errors} name="therapeutic_plan" />

          <LabelInput value="Evolução" />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                activeOutlineColor={colorPrimary}
                dense
                mode="outlined"
                value={value}
                onChangeText={onChange}
              />
            )}
            name="patients_progress"
          />
          <ErrorMessage errors={errors} name="patients_progress" />

          <LabelInput value="Encaminhamentos" />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                activeOutlineColor={colorPrimary}
                dense
                mode="outlined"
                value={value}
                onChangeText={onChange}
              />
            )}
            name="referrals"
          />
          <ErrorMessage errors={errors} name="referrals" />
        </View>

        <View style={{ marginBottom: 40 }}>
          <Button
            buttonColor={colorPrimary}
            textColor='white'
            loading={loading}
            onPress={handleSubmit(getPdf)}
            mode="text"
          >
            Gerar relatório
          </Button>
        </View>
      </ScrollView>
    </KeyboardView>
  );
};

export default DischargeReportPdf;
