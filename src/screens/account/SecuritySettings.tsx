import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { ContextGlobal, useGlobal } from '../../context/GlobalContext';
import { colorPrimary } from '../../style/ColorPalette';

const SecuritySettings = () => {
    const { useBiometrics, setUseBiometrics } = useGlobal();;

    const toggleBiometrics = () => {
        setUseBiometrics(prev => !prev);
    };

    return (
        <View style={styles.container}>
            <View style={styles.optionContainer}>
                <Text>Biometria {(useBiometrics) ? "ativada" : "desativada"}</Text>
                <Switch
                    color={colorPrimary}
                    value={useBiometrics}
                    onValueChange={toggleBiometrics}
                />
            </View>
            <Text style={styles.description}>
                A biometria é usada apenas para acessar o aplicativo. O FonotherApp não coleta, trata ou armazena essa informação. Ela é utilizada apenas no aparelho e segue os termos de uso e as políticas de privacidade de cada fabricante.
            </Text>

            <View style={styles.optionContainer}>
                <Text>Bloqueio de tela</Text>
                <Text>Nunca</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    description: {
        marginTop: 10,
        marginBottom: 20,
        color: '#555555',
    },
});

export default SecuritySettings;
