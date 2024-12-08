import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../config/Api";
import { FormatUser } from "../interfaces/globalInterface";

export const getUser = async (setUser: Function) => {

    try {
        const response = await api.get(`/my-user`);
        await AsyncStorage.removeItem("usuario");
        await AsyncStorage.setItem("usuario", JSON.stringify(response.data));
        const user: FormatUser = response.data;
        if (user?.profile_picture_url !== null) {
            const newUser = {
                ...user,
                profile_picture_url: user?.profile_picture_url + "?" + new Date().getTime()
            }
            setUser(newUser)
        } else {
            setUser(response.data);

        }

        return response.data;

    } catch (error) {
        alert("error")

    }

}