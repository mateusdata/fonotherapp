import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Linking } from 'react-native';
import { TextArea } from 'tamagui';
import { useForm } from 'react-hook-form';
import { Button } from 'react-native-paper';
import { Context } from '../../context/AuthProvider';
import { api } from '../../config/Api';
import ErrorMessage from '../../components/errorMessage';
import { colorPrimary } from '../../style/ColorPalette';
import Toast from '../../components/toast';

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
        const email = 'fonoterapp@gmail.com';
        const subject = `Susgestão do app - Paciente ${user?.nick_name}`;
        const body =  data?.suggestion;
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            Linking.openURL(url);
            reset()
        } else {
            alert("error")

        }

     
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>fonotherApp</Text>
                <Text style={styles.text}>{`Olá ${user.nick_name}, Envie seu Feedback`}</Text>
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
