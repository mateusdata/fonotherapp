import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Dispatch, PropsWithChildren, SetStateAction, createContext, useState, useEffect } from 'react';



interface FormatGlobal {
    thereSession: any,
    setThereSession: Dispatch<SetStateAction<boolean>>,
    isFromRegistration: boolean,
    setIsFromRegistration: Dispatch<SetStateAction<boolean>>,
    isDevelopment: boolean,
    setIsdevelopment: Dispatch<SetStateAction<boolean>>,
    useBiometrics: boolean,
    setUseBiometrics: Dispatch<SetStateAction<boolean>>
}

export const ContextGlobal = createContext<FormatGlobal>({} as FormatGlobal);

const GlobalContext: React.FC<PropsWithChildren> = ({ children }) => {
    const [thereSession, setThereSession] = useState<boolean>(false);
    const [isFromRegistration, setIsFromRegistration] = useState<boolean>(false);
    const [isDevelopment, setIsdevelopment] = useState<boolean>(true);
    const [useBiometrics, setUseBiometrics] = useState<boolean>(false);

    // Recuperar o valor de useBiometrics do localStorage ao inicializar
    useEffect(() => {
        const fetchBiometrics = async () => {
            const storedBiometrics = await AsyncStorage.getItem('useBiometrics');
            if (storedBiometrics !== null) {
                setUseBiometrics(JSON.parse(storedBiometrics));
            }
        };
        fetchBiometrics();
    }, []);

    // Atualizar o localStorage sempre que useBiometrics mudar
    useEffect(() => {
        AsyncStorage.setItem('useBiometrics', JSON.stringify(useBiometrics));
    }, [useBiometrics]);

    return (
        <ContextGlobal.Provider
            value={{
                isDevelopment,
                setIsdevelopment,                
                thereSession,
                setThereSession,
                isFromRegistration,
                setIsFromRegistration,
                useBiometrics,
                setUseBiometrics
            }}>
            {children}
        </ContextGlobal.Provider>
    );
}

export default GlobalContext;
