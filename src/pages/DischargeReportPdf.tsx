import React, { useContext, useEffect, useState } from 'react'
import { Alert, Platform, ScrollView, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { Context } from '../context/AuthProvider'
import { ContextPacient } from '../context/PacientContext'
import { FormatPacient } from '../interfaces/globalInterface'
import CustomText from '../components/customText'
import { Controller, useForm } from 'react-hook-form'
import ErrorMessage from '../components/errorMessage'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { colorGreen, colorPrimary, colorSecundary } from '../style/ColorPalette'
import { ContextGlobal } from '../context/GlobalContext'
import downloadPDF from '../utils/downloadPDF'
import { api }  from '../config/Api'
const DischargeReportPdf = ({ route }: any) => {

  const { pacient, }: { pacient: FormatPacient } = route.params;
  const { user } = useContext(Context);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfName = `Relatório de alta  ${pacient.person.first_name} - ${pacient.person.cpf}.pdf`;
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    medical_diagnoses: yup.string().required("Campo obrigatório"),
    how_it_was_discovered: yup.string().required("Campo obrigatório"),
    first_session_findings: yup.string().required("Campo obrigatório"),
    therapeutic_plan: yup.string().required("Campo obrigatório"),
    patients_progress: yup.string().required("Campo obrigatório"),
    current_condition: yup.string().required("Campo obrigatório"),
    referrals: yup.string().required("Campo obrigatório"),
    lat: yup.number().optional(),
    lon: yup.number().optional()
  });

  const { location, setLocation } = useContext(ContextGlobal);

  const { control, formState: { errors }, reset, watch, handleSubmit } = useForm({
    defaultValues: {
      medical_diagnoses: "",
      how_it_was_discovered: "",
      first_session_findings: "",
      therapeutic_plan: "",
      patients_progress: "",
      current_condition: "",
      referrals: "",
      lat: location.latitude,
      lon: location.longitude
    },
    resolver: yupResolver(schema)
  })

  const handleError = error => console.log("error");

  async function getPdf(values: any) {
    try {
      setLoading(true);
      const response: any = await api.post(`/discharg-report/${pacient?.pac_id}`, values)

      await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, user?.token, setLoading)
    } catch (error) {
      console.error("Ocorreu um erro", error)
      alert("Erro ao gerar pdf")

    }
  }



  const nomeChaves: { [key: string]: string } = {
    medical_diagnoses: "Diagnósticos",
    how_it_was_discovered: "Como foi descoberto",
    first_session_findings: "Avaliação Inicial",
    therapeutic_plan: "Plano Terapêutico",
    patients_progress: "Progresso dos Pacientes",
    current_condition: "Condição Atual",
    referrals: "Encaminhamentos"
  };


  return (
    <ScrollView style={{ padding: 10 }}>
      <View >
        <CustomText fontFamily='Poppins_300Light' style={{ textAlign: "center", fontSize: 17, paddingHorizontal: 0 }}>
          Relatório de alta do paciente
        </CustomText>
        <CustomText fontFamily='Poppins_300Light' style={{ textAlign: "center", fontSize: 17, color: colorSecundary }}>
          {pacient.person.first_name}
        </CustomText>
      </View>

      <View>
        {Object.keys(schema.fields).filter((item)=> item!="lat" && item!=="lon").map((key) => (
          <React.Fragment key={key}>
            {schema.fields.hasOwnProperty(key) && (
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    activeOutlineColor={colorSecundary}
                    label={nomeChaves[key]}
                    mode='outlined'
                    value={value.toString()}
                    onChangeText={onChange}
                  />
                )}
                name={key as keyof typeof schema.fields}
              />
            )}
            <ErrorMessage errors={errors} name={key} />
          </React.Fragment>
        ))}
      </View>



      <View style={{ padding: 12 }}>
        <Button buttonColor={colorPrimary} textColor='white'
          loading={!!progressPercentage} onPress={handleSubmit(getPdf, handleError)} mode='text'>
          Gerar relatório
        </Button>
      </View>
    </ScrollView>
  )
}

export default DischargeReportPdf
