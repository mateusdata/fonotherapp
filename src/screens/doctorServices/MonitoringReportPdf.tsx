import React, { useContext, useEffect, useState } from 'react'
import { Alert, Platform, ScrollView, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { Controller, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { FormatPacient } from '../../interfaces/globalInterface'
import { useAuth } from '../../context/AuthProvider'
import { ContextGlobal } from '../../context/GlobalContext'
import downloadPDF from '../../utils/downloadPDF'
import { api } from '../../config/Api'

import { colorPrimary, colorSecundary } from '../../style/ColorPalette'
import ErrorMessage from '../../components/errorMessage'
import LabelInput from '../../components/LabelInput'
import KeyboardView from '../../components/KeyboardView'

const MonitoringReportPdf = ({ route }: any) => {

    const { pacient, }: { pacient: FormatPacient } = route.params;
    const { user, accessToken } = useAuth();
    const [loading, setLoading] = useState(false);

    const schema = yup.object({
        diagnoses: yup.string().required("Campo obrigatório"),
        structural_assessment: yup.string().required("Campo obrigatório"),
        functional_assessment: yup.string().required("Campo obrigatório"),
        swallowing_assessment: yup.string().required("Campo obrigatório"),
        general_guidelines: yup.string().required("Campo obrigatório"),
        conclusion: yup.string().required("Campo obrigatório"),
        next_steps: yup.string().required("Campo obrigatório"),
       
    });

    const { control, formState: { errors }, reset, watch, handleSubmit } = useForm({
        defaultValues: {
            diagnoses: "",
            structural_assessment: "",
            functional_assessment: "",
            swallowing_assessment: "",
            general_guidelines: "",
            conclusion: "",
            next_steps: "",    
        },
        resolver: yupResolver(schema)
    })


    async function getPdf(values: any) {
        try {
            setLoading(true);
           

            const response: any = await api.post(`/follow-up-report/${pacient?.pac_id}`, values)

            await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, accessToken, setLoading)
        } catch (error) {
            console.error("Ocorreu um erro", error)
        }
    }


    return (
        <KeyboardView>
        <ScrollView style={{ padding: 10, }}>
            <Text  style={{ textAlign: "center", fontSize: 17, paddingHorizontal: 0 }}>
                Relatório de acompanhamento do paciente   {pacient.person.name}
            </Text>

            <View>

                <LabelInput value='Diagnóstico' />
                <Controller
                    control={control}
                    render={({ field: { onChange, name, value } }) => (
                        <TextInput
                            activeOutlineColor={colorPrimary}
                            mode='outlined'
                            dense
                            value={value}
                            onChangeText={onChange} />
                    )}
                    name='diagnoses'
                />
                <ErrorMessage errors={errors} name="diagnoses" />

                <LabelInput value='Avaliação Estrutural' />
                <Controller
                    control={control}
                    render={({ field: { onChange, name, value } }) => (
                        <TextInput
                            activeOutlineColor={colorPrimary}
                            dense
                            mode='outlined'
                            value={value}
                            onChangeText={onChange} />
                    )}
                    name='structural_assessment'
                />
                <ErrorMessage errors={errors} name="structural_assessment" />

                <LabelInput value='Avaliação Funcional' />
                <Controller
                    control={control}
                    render={({ field: { onChange, name, value } }) => (
                        <TextInput
                            activeOutlineColor={colorPrimary}
                            dense
                            mode='outlined'
                            value={value}
                            onChangeText={onChange} />
                    )}
                    name='functional_assessment'
                />
                <ErrorMessage errors={errors} name="functional_assessment" />


                <LabelInput value='Parecer de deglutição' />
                <Controller
                    control={control}
                    render={({ field: { onChange, name, value } }) => (
                        <TextInput
                            activeOutlineColor={colorPrimary}
                            dense
                            mode='outlined'
                            value={value}
                            onChangeText={onChange} />
                    )}
                    name='swallowing_assessment'
                />
                <ErrorMessage errors={errors} name="swallowing_assessment" />

                <LabelInput value='Orientações Gerais' />
                <Controller
                    control={control}
                    render={({ field: { onChange, name, value } }) => (
                        <TextInput
                            activeOutlineColor={colorPrimary}
                            dense
                            mode='outlined'
                            value={value}
                            onChangeText={onChange} />
                    )}
                    name='general_guidelines'
                />
                <ErrorMessage errors={errors} name="general_guidelines" />

                <LabelInput value='Conduta' />
                <Controller
                    control={control}
                    render={({ field: { onChange, name, value } }) => (
                        <TextInput
                            activeOutlineColor={colorPrimary}
                            dense
                            mode='outlined'
                            value={value}
                            onChangeText={onChange} />
                    )}
                    name='conclusion'
                />
                <ErrorMessage errors={errors} name="conclusion" />

                <LabelInput value='Seguimento' />
                <Controller
                    control={control}
                    render={({ field: { onChange, name, value } }) => (
                        <TextInput
                            activeOutlineColor={colorPrimary}
                            dense
                            mode='outlined'
                            value={value}
                            onChangeText={onChange} />
                    )}
                    name='next_steps'
                />
                <ErrorMessage errors={errors} name="next_steps" />
            </View>

            <View style={{ marginBottom: 40 }}>
                <Button buttonColor={colorPrimary} textColor='white'
                    loading={loading} onPress={handleSubmit(getPdf)} mode='text'>
                    Gerar relatório
                </Button>
            </View>
        </ScrollView>
        </KeyboardView>
    )
}

export default MonitoringReportPdf
