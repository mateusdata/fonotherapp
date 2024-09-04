import React, { useContext, useState } from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as  Animatable from "react-native-animatable"
import { LinearGradient } from 'expo-linear-gradient';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { Context } from '../../context/AuthProvider';
import { ContextGlobal } from '../../context/GlobalContext';
import { api } from '../../config/Api';
import { styleGradient } from '../../style/styleGradient';
import CustomText from '../../components/customText';
import LabelInput from '../../components/LabelInput';
import { colorPrimary, colorSecundary } from '../../style/ColorPalette';
import ErrorMessage from '../../components/errorMessage';
import { getUser } from '../../utils/getUser';


const Login = ({ navigation }: any) => {
    const { setLoadingAuth, setUser, setAccessToken } = useContext(Context);
    const { isDevelopment, setIsdevelopment } = useContext(ContextGlobal)

    const schema = yup.object({
        email: yup
            .string()
            .transform(value => value.toLowerCase())
            .required('Obrigatório')
            .max(40, 'O tamanho máximo do texto é 40 caracteres')
            .email("Email inválido"),

        password: yup
            .string()
            .required('Obrigatório')
            .max(40, 'O tamanho máximo do texto é 40 caracteres')
            .min(5, 'Informe uma senha maior'),
    }).required();

    const [loading, setLoading] = useState(false);
    const { watch, handleSubmit, setError, trigger, control, formState: { errors }, setValue } = useForm({
        defaultValues: {
            email: isDevelopment ? "mateuspele2015@gmail.com" : "",
            password: isDevelopment ? "1234567" : ""
        },
        mode: "onChange",
        resolver: yupResolver(schema)
    });




    const onSubmit = async (data: object) => {
        try {
            setLoading(true);
            const response = await api.post("/login", data);

            try {

                await AsyncStorage.setItem("accessToken", JSON.stringify(response?.data?.token));
                setAccessToken(response?.data?.token)                               
                
                if (response.status === 202) {
                    setLoading(false)
                    setError("email", {})
                    return setError("password", { message: response?.data?.message });
                }
                setLoadingAuth(true);
               await getUser(setUser)
            } catch (error) {
                alert("erro")
            }
            setLoadingAuth(false);

        } catch (error) {
            console.log(error)

            setLoading(false);
            if (error?.response) {
                if (error?.response?.status === 401) {
                    setError("email", {})
                    return setError("password", { message: "email ou senha incorretos" });
                }

            }
            setError("password", { message: "Ocorreu um erro!" })
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[
                    'hsla(205, 100%, 95%, 1)',
                    'hsla(320, 100%, 99%, 1)',
                    'hsla(210, 100%, 97%, 1)',
                    'hsla(205, 100%, 95%, 1)',
                    'hsla(313, 100%, 98%, 1)'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styleGradient.background}
            />
            <StatusBar animated hideTransitionAnimation='fade' style='light' />

            <Animatable.View style={styles.titleContainer}>
                <CustomText style={styles.titleText}>Bem-vindo de volta</CustomText>
            </Animatable.View>

            <View style={styles.formContainer}>

                <LabelInput value='Email' />
                <Controller control={control}
                    render={({ field: { onChange, onBlur, value, } }) => (
                        <TextInput
                            mode="outlined"
                            dense
                            autoCorrect={false}                            
                            outlineColor={errors?.email? "red": "gray"}   
                            activeOutlineColor={errors?.email? "red" : colorPrimary}
                            error={!!errors.email}
                            onBlur={onBlur} onChangeText={onChange} value={value}
                        />
                    )}
                    name="email"
                />

                <ErrorMessage name={"email"} errors={errors} mt={5} mb={2} />

                <LabelInput value='Senha' />
                <Controller control={control}
                    render={({ field: { onChange, onBlur, value, } }) => (
                        <TextInput
                            mode="outlined"
                            dense
                            autoCorrect={false}                            
                            outlineColor={errors?.password? "red": "gray"}   
                            activeOutlineColor={errors?.password? "red" : colorPrimary}
                            error={!!errors.password}
                            onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry
                        />
                    )}
                    name="password"
                />

                <ErrorMessage name={"password"} errors={errors} mt={5} mb={2} />


                <View>
                    <Button
                        mode='contained-tonal'
                        loading={loading}
                        disabled={loading}
                        buttonColor='#36B3B1'
                        textColor='white'
                        style={styles.button}
                        onPress={handleSubmit(onSubmit)}>
                        Entrar
                    </Button>
                </View>
                <View style={{ width: "auto", alignItems: "center", justifyContent: "center", marginTop: 15 }}>
                    <CustomText style={{ fontFamily: "Poppins_600SemiBold", color: "gray" }}>Esqueceu sua senha ?</CustomText>
                    <Pressable onPress={() => navigation.navigate("SendEmail")}>
                        <CustomText style={{ fontFamily: "Poppins_600SemiBold", color: "#407AFF" }}>Recuperar senha</CustomText>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        fontFamily: "Poppins_600SemiBold",
        flex: 1,
        justifyContent: 'flex-start',
        padding: 2,
    },
    titleContainer: {
        fontFamily: "Poppins_600SemiBold",
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontFamily: "Poppins_800ExtraBold",
        fontSize: 25,
        marginBottom: 0,
        marginTop: 0,
        color: "#4d4d4f"
    },
    formContainer: {
        fontFamily: "Poppins_600SemiBold",
        flex: 1,
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        gap: 0
    },
    label: {
        fontFamily: "Poppins_600SemiBold",
        color: '#000000',
        marginBottom: 5,
    },
    input: {
        fontFamily: "Poppins_600SemiBold",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000000',
        height: 40,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        fontFamily: "Poppins_600SemiBold",
        //git backgroundColor: '#407AFF',
        borderRadius: 5,
        padding: 5,
        marginTop: 15,
    },
    buttonText: {
        fontFamily: "Poppins_800ExtraBold",
        color: '#f4f4f4',
        fontWeight: 'bold',
        fontSize: 17
    },
});

export default Login;
