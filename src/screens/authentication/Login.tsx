import React, { useContext, useState } from 'react';
import { View, Pressable, StyleSheet, Image, Text, ScrollView } from 'react-native';
import { Avatar, Button, TextInput } from 'react-native-paper';
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
import LabelInput from '../../components/LabelInput';
import { colorPrimary } from '../../style/ColorPalette';
import ErrorMessage from '../../components/errorMessage';
import { getUser } from '../../utils/getUser';
import KeyboardView from '../../components/KeyboardView';

const Login = ({ navigation }: any) => {
    const { setLoadingAuth, setUser, setAccessToken } = useContext(Context);
    const { isDevelopment, setIsdevelopment } = useContext(ContextGlobal);

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
        mode: "onSubmit",
        resolver: yupResolver(schema)
    });

    const [passwordVisible, setPasswordVisible] = useState(false); // Controla a visibilidade da senha

    const onSubmit = async (data: object) => {
        try {
            setLoading(true);
            const response = await api.post("/login", data);

            try {
                await AsyncStorage.setItem("accessToken", JSON.stringify(response?.data?.token));
                setAccessToken(response?.data?.token);

                if (response.status === 202) {
                    setLoading(false);
                    setError("email", {});
                    return setError("password", { message: response?.data?.message });
                }
                setLoadingAuth(true);
                await getUser(setUser);
            } catch (error) {
                alert("erro");
            }
            setLoadingAuth(false);
        } catch (error) {
            setLoading(false);
            setError("email", { message: "" });
            if (!error?.response) {
                setError("email", {});
                return setError("password", { message: "Sem conexão com a internet" });
            }

            if (error?.response?.status === 400) {
                return setError("password", { message: "Usuário ou senha incorretos, tente novamente ou clique em 'Recuperar senha’ " });
            }

            setLoading(false);
        }
    };

    return (
        <KeyboardView style={styles.container}>
              <LinearGradient
                    colors={['hsla(205, 100%, 95%, 1)', 'hsla(320, 100%, 99%, 1)', 'hsla(210, 100%, 97%, 1)', 'hsla(205, 100%, 95%, 1)', 'hsla(313, 100%, 98%, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styleGradient.background}
                />
            <ScrollView style={{flex:1}}>
              
                <StatusBar animated hideTransitionAnimation='fade' style='light' />

                <Animatable.View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Bem-vindo de volta</Text>
                    <Avatar.Image style={{ backgroundColor: "transparent" }} size={52} source={require('../../assets/images/logo.png')} />
                </Animatable.View>

                <View style={styles.formContainer}>

                    <LabelInput value='Email' />
                    <Controller control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                mode="outlined"
                                testID='email'
                                dense
                                autoCorrect={false}
                                outlineColor={errors?.email ? "red" : "gray"}
                                activeOutlineColor={errors?.email ? "red" : colorPrimary}
                                error={!!errors.email}
                                onBlur={onBlur} onChangeText={onChange} value={value}
                            />
                        )}
                        name="email"
                    />
                    <ErrorMessage name={"email"} errors={errors} mt={5} mb={2} />

                    <LabelInput value='Senha' />
                    <View >
                        <Controller control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    testID='password'
                                    mode="outlined"
                                    dense
                                    autoCorrect={false}
                                    outlineColor={errors?.password ? "red" : "gray"}
                                    activeOutlineColor={errors?.password ? "red" : colorPrimary}
                                    error={!!errors.password}
                                    onBlur={onBlur} onChangeText={onChange} value={value}
                                    secureTextEntry={!passwordVisible}
                                    right={watch("password") && <TextInput.Icon
                                        icon={passwordVisible ? "eye-off" : "eye"}
                                        onPress={() => setPasswordVisible(!passwordVisible)}
                                    />
                                    }
                                />
                            )}
                            name="password"
                        />

                    </View>

                    <ErrorMessage name={"password"} errors={errors} mt={5} mb={2} />

                    <View>
                        <Button
                            testID='login'
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
                        <Text style={{ color: "gray" }}>Esqueceu sua senha ?</Text>
                        <Pressable onPress={() => navigation.navigate("SendEmail")}>
                            <Text style={{ color: "#407AFF" }}>Recuperar senha</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardView>
    );
};

const styles = StyleSheet.create({
    container: {

        flex: 1,
        justifyContent: 'flex-start',
        padding: 2,
    },
    titleContainer: {

        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 25,
        marginBottom: 0,
        marginTop: 0,
        color: "#4d4d4f"
    },
    formContainer: {

        flex: 1,
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        gap: 0
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 12,
    },
    label: {

        color: '#000000',
        marginBottom: 5,
    },
    input: {

        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000000',
        height: 40,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {

        borderRadius: 5,
        padding: 5,
        marginTop: 15,
    },
    buttonText: {
        color: '#f4f4f4',
    },
    inputContainer: {
        marginBottom: 20
    },
});

export default Login;
