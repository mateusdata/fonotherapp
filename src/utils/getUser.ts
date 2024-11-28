import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../config/Api";

export const getUser = async (setUser: Function) => {

    try {
        const response = await api.get(`/my-user`);
        await AsyncStorage.removeItem("usuario");
        await AsyncStorage.setItem("usuario", JSON.stringify(response.data));
        setUser(response.data);
       

    } catch (error) {
        alert("error")
       

    }

}