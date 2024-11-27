import React, { useContext, useState } from 'react'
import { ActivityIndicator, Button, TextInput } from 'react-native-paper'
import { Controller, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

import { View } from 'react-native-animatable'
import { FormatPacient } from '../../interfaces/globalInterface'
import { Context } from '../../context/AuthProvider'
import { ContextGlobal } from '../../context/GlobalContext'
import downloadPDF from '../../utils/downloadPDF'
import { api } from '../../config/Api'
import CustomText from '../../components/customText'
import { colorGreen, colorPrimary, colorRed, colorSecundary } from '../../style/ColorPalette'
import ErrorMessage from '../../components/errorMessage'
import { ContextPacient } from '../../context/PacientContext';
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';
import LabelInput from '../../components/LabelInput'
import { Text } from 'react-native'
import KeyboardView from '../../components/KeyboardView'

const ServiceProvisionReceiptPdf = ({ route }: any) => {

  const { pacient, }: { pacient: FormatPacient } = route.params;
  const { user, accessToken } = useContext(Context);
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


  const handleError = error => console.log("error");

  async function getPdf(values: any) {
    try {
      setLoading(true);
      console.log(typeof values.number_of_sessions)

      const response: any = await api.post(`/service-term/${pacient?.pac_id}`, values)

      await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, accessToken, setLoading)
    } catch (error) {
      console.error("Ocorreu um erro", error)
      setLoading(false);

    }
  }

  return (
    <KeyboardView style={{ padding: 10 }}>
      <View >
        <CustomText fontFamily='Poppins_300Light' style={{ textAlign: "center", fontSize: 17, paddingHorizontal: 0 }}>
          Recibo de prestação de serviço de
        </CustomText>
        <CustomText fontFamily='Poppins_300Light' style={{ textAlign: "center", fontSize: 17, color: colorSecundary }}>
          {pacient.first_name}
        </CustomText>
      </View>
      <View>

        <LabelInput value='Preço' />
        <Controller
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <TextInput
              keyboardType='numeric'
              activeOutlineColor={colorPrimary}
              autoFocus 
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
