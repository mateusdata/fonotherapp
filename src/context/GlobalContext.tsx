import React, { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from 'react';

interface Location {
    latitude: number,
    longitude: number
}

interface FormatGlobal {
    location: Location,
    setLocation: Dispatch<SetStateAction<Location>>,
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

    const [location, setLocation] = useState<any>({
        latitude: null,
        longitude: null
    });
    const [thereSession, setThereSession] = useState<boolean>(false);
    const [isFromRegistration, setIsFromRegistration] = useState<boolean>(false);
    const [isDevelopment, setIsdevelopment] = useState<boolean>(false)
    const [useBiometrics, setUseBiometrics] = useState(true);



    return (
        <ContextGlobal.Provider
            value={{
                isDevelopment,
                setIsdevelopment,
                location,
                setLocation,
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
