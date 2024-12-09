import React, { useContext, useState } from 'react'
import { ActivityIndicator, Button, TextInput } from 'react-native-paper'
import { Controller, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

import { View } from 'react-native-animatable'
import { FormatPacient } from '../../interfaces/globalInterface'
import { Context, useAuth } from '../../context/AuthProvider'
import { ContextGlobal } from '../../context/GlobalContext'
import downloadPDF from '../../utils/downloadPDF'
import { api } from '../../config/Api'

import { colorGreen, colorPrimary, colorRed, colorSecundary } from '../../constants/ColorPalette'
import ErrorMessage from '../../components/errorMessage'
import { ContextPacient } from '../../context/PacientContext';
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';
import LabelInput from '../../components/LabelInput'
import { Text } from 'react-native'
import KeyboardView from '../../components/KeyboardView'

const ServiceProvisionReceiptPdf = ({ route }: any) => {

  const { pacient, }: { pacient: FormatPacient } = route.params;
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    price: yup.number().required("Campo obrigatorio"),
    number_of_sessions: yup.number().required("Campo obrigatorio"),
  });

  const { control, formState: { errors }, reset, watch, handleSubmit } = useForm({
    defaultValues: {
      price: null,
      number_of_sessions: null,

    },
    resolver: yupResolver(schema)
  })



  async function getPdf(values: any) {
    try {
      const response: any = await api.post(`/service-term/${pacient?.pac_id}`, values)
      await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, accessToken, setLoading)
    } catch (error) {
      console.error("Ocorreu um erro", error)
      setLoading(false);

    }
  }

  return (
    <KeyboardView style={{ padding: 20 }}>
     
      <View>

        <LabelInput value='Preço' />
        <Controller
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <TextInput
              keyboardType='numeric'
              activeOutlineColor={colorPrimary}
              dense              
              mode='outlined'
              value={value?.toString()}
              onChangeText={onChange} />
          )}
          name='price'
        />
        <ErrorMessage errors={errors} name="price" />

        <LabelInput value='Número de sessões' />
        <Controller
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <TextInput keyboardType='number-pad'
              activeOutlineColor={colorPrimary}
              dense              
              mode='outlined'
              value={value?.toString()}
              onChangeText={onChange} />
          )}
          name='number_of_sessions'
        />
        <ErrorMessage errors={errors} name="number_of_sessions" />



      </View>
      <View style={{ marginBottom: 40 }}>
      <Button buttonColor={colorPrimary} textColor='white'
          loading={loading} onPress={handleSubmit(getPdf)} mode='text'>
          Gerar Recibo
        </Button>
      </View>
    </KeyboardView>
  )
}

export default ServiceProvisionReceiptPdf
