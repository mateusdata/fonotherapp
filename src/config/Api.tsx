import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, ToastAndroid } from 'react-native';
import { colorRed } from '../style/ColorPalette';
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

      //console.log(response);
      
      if(response.status === 202){
        showToast("info", "Atenção", response?.data?.message, "top")
        return null;
      }
      return response;
    },
    async (error) => {
      // Verifique se o erro é um 401
      console.log(error.response.status);
      if (!error.response && !isSessionExpiredToastShown) {
        isSessionExpiredToastShown = true;
        showToast("error", "Você perdeu a conexão com a internet", "Verifique sua conexão", "top")
      }

     

      if (error.response.status === 401) {
        try {
          // Se o toast ainda não foi mostrado, mostre-o e marque como mostrado
          // isSessionExpiredToastShown = true;
          showToast("error", "Sessão expirada", "faça login novamente", "bottom")

          // Limpe o AsyncStorage e faça logout
          await logOut();
        } catch (asyncStorageError) {
          console.error("Error removing user from AsyncStorage:", asyncStorageError);
        }
      }

      // Rejeite a promessa com o erro original
      return Promise.reject(error);
    }
  );
}

export { api, setInterceptors };
