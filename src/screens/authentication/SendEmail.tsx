import * as React from 'react';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { View, StyleSheet, Keyboard, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../config/Api';
import CustomText from '../../components/customText';
import LabelInput from '../../components/LabelInput';
import ErrorMessage from '../../components/errorMessage';


export default function SendEmail({ navigation }) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showToast, setShowToast] = React.useState<boolean>(false)
    Keyboard.isVisible()
    const schema = yup.object({
        email: yup.string().email("Email inválido").min(6, "Email é muito pequeno")
    })
    const { control, handleSubmit, setError, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      mode: "onSubmit",
        defaultValues: {
            email: "",
        }
    })
    const onSubmit = async (data: any) => {
        setLoading(true);

        try {
            const response = await api.post("/send-reset-code", data)
           
            navigation.navigate("CheckCode", { email: data?.email });
            setLoading(false);


        } catch (error) {
            setLoading(false);
            setError("email", { message: "Ocorreu um erro" })
        }

    }
    return (
        <View style={styles.container}>
            <View style={{ flex: 0.9 }}>

                <View style={{ gap: 10, marginTop: 5 }}>
                    <CustomText fontFamily='Poppins_300Light' style={{ fontSize: 17, textAlign: "center" }}>
                        Insira seu email pra obter um código de recumperação
                    </CustomText>
                </View>
                <LabelInput value='Email' />
                <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            dense
                            error={!!errors.email}
                            onChangeText={onChange}
                            mode="outlined"
                            style={styles.input}
                            activeOutlineColor='#376fe8'
                            value={value}
                        />
                    )}
                    name='email'
                />
                <ErrorMessage name={"email"} errors={errors} />
            </View>

            <Button
                loading={loading}
                buttonColor='#36B3B1'
                textColor='white'
                style={styles.button}
                onPress={handleSubmit(onSubmit)}>
                Próximo
            </Button>

            <View style={{ width: "auto", alignItems: "center", justifyContent: "center", marginTop: 15 }}>
                <CustomText fontFamily='Poppins_300Light' style={{ color: "gray" }}>Lembrou sua senha</CustomText>
                <Pressable onPress={() => navigation.navigate("Login")}>
                    <CustomText fontFamily='Poppins_300Light' style={{ color: "#407AFF" }}>Fazer login</CustomText>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 18,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        padding: 5
    }
});
