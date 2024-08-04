import React, { useContext, useState } from 'react'
import { ActivityIndicator, Button, TextInput } from 'react-native-paper'
import { Context } from '../context/AuthProvider'
import { FormatPacient } from '../interfaces/globalInterface'
import CustomText from '../components/customText'
import { Controller, useForm } from 'react-hook-form'
import ErrorMessage from '../components/errorMessage'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { colorGreen, colorPrimary, colorSecundary } from '../style/ColorPalette'
import { ContextGlobal } from '../context/GlobalContext'
import { api }  from '../config/Api'
import downloadPDF from '../utils/downloadPDF'
import { View } from 'react-native-animatable'
const ServiceProvisionReceiptPdf = ({ route }: any) => {

  const { pacient, }: { pacient: FormatPacient } = route.params;
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    price: yup.number().required("Campo obrigatorio"),
    number_of_sessions: yup.number().required("Campo obrigatorio"),
    lat: yup.number().optional(),
    lon: yup.number().optional()
  });
  const { location } = useContext(ContextGlobal);

  const { control, formState: { errors }, reset, watch, handleSubmit } = useForm({
    defaultValues: {
      price: null,
      number_of_sessions: null,
      lat: location.latitude,
      lon:location.longitude
    },
    resolver: yupResolver(schema)
  })


  const handleError = error => console.log("error");

  async function getPdf(values: any) {
    try {
      setLoading(true);
      console.log(typeof values.number_of_sessions)

      const response: any = await api.post(`/service-term/${pacient?.pac_id}`, values)

      await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, user?.token, setLoading)
    } catch (error) {
      console.error("Ocorreu um erro", error)
      setLoading(false);

    }
  }

  return (
    <View style={{ padding: 10 }}>
      <View >
        <CustomText fontFamily='Poppins_300Light' style={{ textAlign: "center", fontSize: 17, paddingHorizontal: 0 }}>
          Recibo de prestação de serviço do paciente
        </CustomText>
        <CustomText fontFamily='Poppins_300Light' style={{ textAlign: "center", fontSize: 17, color: colorSecundary }}>
          {pacient.first_name}
        </CustomText>
      </View>
      <View>
        <Controller
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <TextInput keyboardType='numeric' activeOutlineColor={colorSecundary} autoFocus label="Preço" mode='outlined' value={value?.toString()} onChangeText={onChange} />
          )}
          name='price'
        />
        <ErrorMessage errors={errors} name="price" />


        <Controller
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <TextInput keyboardType='number-pad' activeOutlineColor={colorSecundary} label="Número de sessões" mode='outlined' value={value?.toString()} onChangeText={onChange} />
          )}
          name='number_of_sessions'
        />
        <ErrorMessage errors={errors} name="number_of_sessions" />



      </View>
      <View style={{ padding: 12 }}>
        <Button buttonColor={colorPrimary} textColor='white'
          loading={loading} onPress={handleSubmit(getPdf, handleError)} mode='text'>
          Gerar Recibo
        </Button>
      </View>
    </View>
  )
}

export default ServiceProvisionReceiptPdf
