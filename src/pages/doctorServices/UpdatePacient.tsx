import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { cpf } from 'cpf-cnpj-validator';
import dayjs from 'dayjs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatePickerInput } from 'react-native-paper-dates';
import { api } from '../../config/Api'
import ErrorMessage from '../../components/errorMessage'
import { FormatPacient } from '../../interfaces/globalInterface';
import Toast from '../../components/toast';



const UpdatePacient = ({ route }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const { pacient }: { pacient: FormatPacient } = route.params
    const [showToast, setShowToast] = useState<boolean>(false);

    const formatCpf = cpf;

    const convertDateToISO = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    };

    const schema = yup.object({
        first_name: yup.string().required("Paciente é obrigatorio").matches(/^(?!^\d+$).+$/,
            { message: 'Não são permitidas  entradas numéricas' }),
        birthday: yup.date().required("Data inválida"),
    }).required();

    const { reset, handleSubmit, watch, setValue, formState: { errors }, control, setError } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            first_name: pacient?.person?.first_name,
            birthday: pacient?.person?.birthday ? dayjs(pacient?.person?.birthday, 'DD/MM/YYYY').toDate() : null,
        }
    });


    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.post(`/pacient/${pacient?.pac_id}`, data);
            setLoading(false);
            setShowToast(true)
        } catch (e) {
            if (e?.response) {
                setLoading(false);
                return setError("first_name", { message: "Oorreu um erro." })

            }
            setLoading(false);
            return setError("first_name", { message: "Sem conexão com a internet, tente novamente" })
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Text>{false && JSON.stringify(pacient?.person, null, 2)}</Text>
                <View style={styles.containerChildren}>
                    <Controller control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                value={value}
                                autoFocus
                                onChangeText={onChange}
                                mode='outlined'
                                label="Nome"
                                activeOutlineColor="#376fe8" />
                        )}
                        name='first_name'
                    />

                    <ErrorMessage name={"first_name"} errors={errors} />



                    <Controller control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <SafeAreaProvider>
                                <View style={{ justifyContent: 'center', flex: 0.2, alignItems: 'center', paddingTop: 15 }}>
                                    <DatePickerInput
                                        error
                                        locale='pt-BR'
                                        label="Data de nascimento "
                                        value={(watch().birthday)}
                                        onChange={onChange}
                                        inputMode="start"
                                        mode='outlined'
                                        activeOutlineColor={`${errors.birthday ? "red" : "#376fe8"}`}
                                        iconStyle={{ display: 'none' }}
                                    />
                                </View>
                            </SafeAreaProvider>

                        )}

                        name='birthday'
                    />
                    <ErrorMessage name={"birthday"} errors={errors} />


                </View>

                <View style={{ flex: 1, width: "90%" }}>
                    <Button
                        disabled={loading} loading={loading} buttonColor='#36B3B9' mode="contained" onPress={handleSubmit(onSubmit)}>
                        Atualizar
                    </Button>
                </View>


            </View>
            <Toast visible={showToast} mensage={"Paciente atualizado"} setVisible={setShowToast} />



        </>
    );
};


export default UpdatePacient;

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
});
