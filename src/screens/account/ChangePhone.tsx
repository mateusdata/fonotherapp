import * as React from 'react';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { View, StyleSheet, Keyboard, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../config/Api';
import LabelInput from '../../components/LabelInput';
import { colorPrimary, colorSecundary } from '../../constants/ColorPalette';
import ErrorMessage from '../../components/errorMessage';
import { getUser } from '../../utils/getUser';
import { useAuth } from '../../context/AuthProvider';
import { showToast } from '../../utils/showToast';


export default function ChangePhone() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = React.useState<boolean>(false);

    Keyboard.isVisible();

    const schema = yup.object({
        phone: yup.string().required("Obrigatório").max(15, "telefone Inválido").min(5, "telefone Inválido"),
    });

    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onSubmit",
        defaultValues: {
            phone: user?.person?.phone_numbers[0]?.ddd + user?.person?.phone_numbers[0]?.number
        }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await api.post(`/phone`, { phone: data.phone, usu_id: user?.use_id });
            await getUser(setUser)
            setLoading(false);
            showToast({
                type: "success",
                text1: "Telefone atualizado",
                position: "bottom"
            });
        } catch (error) {
            setLoading(false);
            setError("phone", { message: "Ocorreu um erro" });
        }

    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.9 }}>
                {<View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 18, marginBottom: 10, padding: 5 }} >
                        {`${!user?.person?.phone_numbers[0]?.ddd ? "Você ainda não cadastrou seu telefone" : "Meu telefone atual"}`}
                    </Text>
                    <Text
                        style={{ fontSize: 18, marginBottom: 10, padding: 5, color: colorSecundary }} >
                        {user?.person?.phone_numbers[0]?.ddd ? (`(${user?.person?.phone_numbers[0]?.ddd}) `) + user?.person?.phone_numbers[0]?.number : false}
                    </Text>
                </View>}

                <LabelInput value='Telefone' />
                <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            dense
                            keyboardType='numbers-and-punctuation'
                            onChangeText={onChange}
                            mode="outlined"
                            style={styles.input}
                            activeOutlineColor={colorPrimary}
                            value={value}
                        />
                    )}
                    name='phone'
                />
                <ErrorMessage name={"phone"} errors={errors} />
                
                <Button
                    loading={loading}
                    buttonColor='#36B3B1'
                    textColor='white'
                    style={styles.button}
                    onPress={handleSubmit(onSubmit)}
                >
                    {user?.person?.phone_numbers[0]?.number ? "Alterar telefone" : "Criar telefone"}
                </Button>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 8,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        padding: 5
    }
});
