import * as React from 'react';
import { Button,  TextInput } from 'react-native-paper';
import { View, StyleSheet, Keyboard, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../config/Api';
import LabelInput from '../../components/LabelInput';
import ErrorMessage from '../../components/errorMessage';
import { colorPrimary, colorSecundary } from '../../constants/ColorPalette';
import { getUser } from '../../utils/getUser';
import { useAuth } from '../../context/AuthProvider';
import { showToast } from '../../utils/showToast';


export default function ChangeGovLicense() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = React.useState<boolean>(false);

    Keyboard.isVisible();

    const schema = yup.object({
        gov_license: yup.string().required("Obrigatório").max(15, "CRFA Inválido").min(5, "CRFA Inválido"),
    });
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onSubmit",
        defaultValues: {
            gov_license: user?.doctor?.gov_license
        }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await api.put(`/doctor/${user?.doctor?.doc_id}`, data);
            await getUser(setUser)

            showToast({
                type: "success",
                text1: "CRFA atualizado",
                position: "bottom"
              });

        } catch (e) {
            setError("gov_license", { message: "Ocorreu um erro" });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.9 }}>
                {<View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 18, marginBottom: 10, padding: 5 }} >{`${!user?.doctor?.gov_license ? "Você ainda não cadastrou seu CRFA" : "Meu CRFA atual"}`}</Text>
                    <Text style={{ fontSize: 18, marginBottom: 10, padding: 5, color: colorSecundary }} >{user?.doctor?.gov_license}</Text>
                </View>}

                <LabelInput value='CRFA' />
                <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            dense
                            onChangeText={onChange}
                            mode="outlined"
                            style={styles.input}
                            activeOutlineColor={colorPrimary}
                            value={value}
                        />
                    )}
                    name='gov_license'
                />
                <ErrorMessage name={"gov_license"} errors={errors} />
                
                <Button
                loading={loading}
                buttonColor='#36B3B1'
                textColor='white'
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
            >
                {user?.doctor?.gov_license ? "Alterar CRFA" : "Criar CRFA"}
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
