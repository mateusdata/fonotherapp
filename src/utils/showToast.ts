import Toast from "react-native-toast-message";
import { colorRed } from "../style/ColorPalette";

export const showToast = (type: "error" | "info" | "success", text1: string, text2: string, position: "bottom" | "top") => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    visibilityTime: 6000,
    text1Style: { fontSize: 13, color: "black" },
    text2Style: { fontSize: 13, color: "black" },
    position: position,
    bottomOffset: 50
  });
}