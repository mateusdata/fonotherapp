import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from 'react-native';
import { colorRed } from '../style/ColorPalette';
import Toast from 'react-native-toast-message';
import { showToast } from '../utils/showToast';

const api = axios.create({
  baseURL: 'https://645b-179-186-19-111.ngrok-free.app',
});

let isSessionExpiredToastShown = false; // Variável para controlar se o toast já foi mostrado



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
      return response;
    },
    async (error) => {
      // Verifique se o erro é um 401
      if (!error.response && !isSessionExpiredToastShown) {
        isSessionExpiredToastShown = true;
        showToast("error", "Voçê perdeu a coneção com a internet", "Verifique sua conexão", "top")
      }

      if (error.response && error.response.status === 401) {
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
