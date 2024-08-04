import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import CustomText from '../components/customText';
import { TextArea } from 'tamagui';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../components/errorMessage';
import { Context } from '../context/AuthProvider';
import { api }  from '../config/Api';
import { colorPrimary, colorRed } from '../style/ColorPalette';
import Toast from '../components/toast';
import { Button } from 'react-native-paper';

const Feedback = () => {
    const [showToast, setShowToast] = useState(false);
    const [mensageToast, setMensageToast] = useState("")
    const { register, trigger, setValue, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            suggestion: ""
        },
    });
    const { user } = useContext(Context);

    const onSubmit = async (data) => {
        try {
            await api.post("/send-feedback", { suggestion: data.suggestion, name: user.nick_name });
            setMensageToast("Obrigado pelo Feedback")
            setShowToast(true);
            reset({ suggestion: '' });
        } catch (error) {
            console.log(error);
            setShowToast(true);
            setMensageToast("Ocorreu um error")


        }
    };

    return (
        <>
            <View style={styles.container}>
                <CustomText fontFamily='Poppins_300Light' style={styles.text}>Fonotherapp</CustomText>
                <CustomText style={styles.text}>{`Olá ${user.nick_name}, Envie seu Feedback`}</CustomText>
                <TextArea
                    multiline
                    autoFocus
                    style={styles.textArea}
                    numberOfLines={5}
                    onChangeText={text => { setValue('suggestion', text); trigger(); }}
                    borderWidth={2}
                    {...register('suggestion', {
                        required: 'Este campo é obrigatório',
                        maxLength: { value: 300, message: "O tamanho máximo do texto é 150 caracteres" },
                        minLength: { value: 3, message: "Informe um texto maior" },
                    })}
                    value={watch().suggestion}
                />
                <ErrorMessage name={"suggestion"} errors={errors} />
                <Button mode='contained-tonal' buttonColor={colorPrimary} textColor='white' onPress={handleSubmit(onSubmit)}>Enviar Feedback</Button>

            </View>
            <Toast visible={showToast} mensage={mensageToast} setVisible={setShowToast} duration={6000} />

        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
        color: colorPrimary
    },
    textArea: {
        minHeight: 200,
        maxHeight: 200,
        width: '100%',
        borderWidth: 1,
        marginTop: 10,
        textAlignVertical: "top",
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
    },
});

export default Feedback;
