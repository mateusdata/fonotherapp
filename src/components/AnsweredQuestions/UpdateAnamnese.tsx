import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ScrollView } from 'react-native-gesture-handler';
import { cpf } from 'cpf-cnpj-validator';
import { api }  from '../../config/Api';
import ErrorMessage from '../errorMessage';
import { FormatPacient } from '../../interfaces/globalInterface';
import Toast from '../toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LabelInput from '../LabelInput';
import { colorPrimary } from '../../style/ColorPalette';


const UpdateAnamnese = ({ pacient, setShowToast, setModalVisible, setSnapPoints }: { pacient: FormatPacient, setShowToast: Function, setModalVisible: Function, setSnapPoints: Function }) => {
    const [loading, setLoading] = useState<boolean>(false)


    const schema = yup.object({
        education: yup.string().required("Obrigatorio"),
        base_diseases: yup.string().required("Obrigatorio"),
        food_profile: yup.string().required("Obrigatorio"),
        chewing_complaint: yup.string().required("Obrigatorio"),
        consultation_reason: yup.string().required("Obrigatorio"),
        current_food_intake_method:yup.string().required("Obrigatorio"),

    }).required();

    const { reset, handleSubmit, watch, formState: { errors }, control, setError } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            education: pacient?.education,
            base_diseases: pacient?.base_diseases,
            chewing_complaint: pacient?.chewing_complaint,
            consultation_reason: pacient?.consultation_reason,
            food_profile: pacient?.food_profile,
            current_food_intake_method: pacient?.current_food_intake_method
        }

    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.put(`/pacient/${pacient?.pac_id}`, data);
            setLoading(false);
            setModalVisible(false)
            setTimeout(() => {
                setShowToast(true)
            }, 300);
        } catch (e) {
            console.log(e);
            
            if (e?.response) {
                setLoading(false);
                return setError("chewing_complaint", { message: "Oorreu um erro." })

            }
            setLoading(false);
            return setError("chewing_complaint", { message: "Sem conexão com a internet, tente novamente" })
        }
    };

    async function changeSnapPoints() {
        setSnapPoints(90)
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.containerChildren}>

                <LabelInput value='Doenças base' />    
                <Controller control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onPress={changeSnapPoints}                           
                            value={value}
                            dense
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
                            onPress={changeSnapPoints}
                            value={value}
                            onChangeText={onChange}
                            mode='outlined'
                            dense
                            activeOutlineColor={colorPrimary} />
                    )}
                    name='food_profile'
                />
                <ErrorMessage name={"food_profile"} errors={errors} />
                
                <LabelInput value='Queichas a deglutição' />  
                <Controller control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onPress={changeSnapPoints}
                            value={value}
                            onChangeText={onChange}
                            mode='outlined'
                            dense
                            activeOutlineColor={colorPrimary} />
                    )}
                    name='chewing_complaint'
                />
                <ErrorMessage name={"chewing_complaint"} errors={errors} />

                <LabelInput value='Escolaridade' />  
                <Controller  control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onPress={changeSnapPoints}
                            value={value}                           
                            onChangeText={onChange}
                            mode='outlined'
                            dense
                            activeOutlineColor={colorPrimary} />
                    )}
                    name='education'
                />
                <ErrorMessage name={"education"} errors={errors} />


                <LabelInput value='Motivo da consulta' />  
                <Controller control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onPress={changeSnapPoints}
                            value={value}
                            onChangeText={onChange}
                            mode='outlined'
                            dense
                            activeOutlineColor={colorPrimary} />
                    )}
                    name='consultation_reason'
                />
                <ErrorMessage name={"consultation_reason"} errors={errors} />

                <LabelInput value='Via de alimentação atual' />  
                <Controller control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onPress={changeSnapPoints}
                            value={value}
                            onChangeText={onChange}
                            mode='outlined'
                            dense
                            activeOutlineColor={colorPrimary} />
                    )}
                    name='current_food_intake_method'
                />
                <ErrorMessage name={"current_food_intake_method"} errors={errors} />
                       
            </ScrollView>


            <Button icon="update" style={{ width: "90%" }}
                disabled={loading} loading={loading} buttonColor='#36B3B9' mode="contained" onPress={handleSubmit(onSubmit)}>
                Atualizar anamnese
            </Button>



        </View>
    );
};


export default UpdateAnamnese;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2,
        justifyContent: 'space-between',
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
});
