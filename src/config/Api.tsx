import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, ToastAndroid } from 'react-native';
import { colorRed } from '../constants/ColorPalette';
import { showToast } from '../utils/showToast';

const api = axios.create({
  baseURL: 'https://api.fonotherapp.com.br',
});

let isSessionExpiredToastShown = false;



api.interceptors.request.use(async (config) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken !== null) {
      const token = JSON.parse(accessToken);

      if (token) {

        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  } catch (error) {
    console.error("Error getting user from AsyncStorage:", error);

    return config;
  }
});

async function setInterceptors(setUser: Function, logOut: any) {
  api.interceptors.response.use(

    (response) => {
  
      (JSON.stringify(response.data, null, 2))
      if (response.status === 202) {
        Alert.alert("Atenção", response?.data?.message)
        return null;
      }
      return response;
    },
    async (error) => {
     
      if (!error.response) {
        isSessionExpiredToastShown = true;
        Alert.alert(" Você perdeu a conexão com a internet", "Por favor, verifique sua conexão e tente novamente")
      }

      if (error.response.status === 500) {
        isSessionExpiredToastShown = true;
        showToast({
          type: "error",
          text1: "Ocorreu um erro",
          position: "bottom",
          bottomOffset: 100
  
        });

      }

      if (error.response.status === 401) {
        try {

          showToast({
            type: "error",
            text1: "Sessão expirada",
            text2: "Faça login novamente",
            position: "bottom"
          });
          await logOut();
        } catch (asyncStorageError) {
          console.error("Error removing user from AsyncStorage:", asyncStorageError);
        }
      }

      return Promise.reject(error);
    }
  );
}

export { api, setInterceptors };
