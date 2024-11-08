import React, { Dispatch, PropsWithChildren, SetStateAction, createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingComponent from "../components/LoadingComponent";
import { ContextProps, FormatUser } from "../interfaces/globalInterface";
import { setInterceptors } from "../config/Api";
import { Text } from "react-native";

export const Context = createContext<ContextProps>({} as ContextProps);

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<FormatUser | null>(null);
    const [accessToken, setAccessToken] = useState<string>(null);

    const [loadingAuth, setLoadingAuth] = useState<boolean>(false);

    useEffect(() => {
        setInterceptors(setUser, logOut)
    }, [user])




    async function recovereData() {
        try {

            setLoadingAuth(true)
            const user = await AsyncStorage.getItem("usuario");
            const token = await AsyncStorage.getItem("accessToken");


            if (user != null && token != null) {
                setUser(JSON.parse(user));
                setAccessToken(JSON.parse(token))
                setLoadingAuth(false);
                return
            }
            setLoadingAuth(false)
        } catch (error) {

        }
    }



    useEffect(() => {
        recovereData()
    }, []);




    const logOut = async () => {
        try {

            setLoadingAuth(true)
            setUser(null);
            setAccessToken(null);
            await AsyncStorage.clear()
            setLoadingAuth(false)

        } catch (error) {
            setUser(null);
            setLoadingAuth(false)

        }


    };
    if (loadingAuth) {
        return <LoadingComponent />
    }

    return (
        <Context.Provider
            value={{
                user,
                setUser,
                logOut,
                loadingAuth,
                setLoadingAuth,
                accessToken,
                setAccessToken
            }}
        >
            {children}
           
        </Context.Provider>
    );

};


export default AuthProvider;



