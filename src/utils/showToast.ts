import Toast from "react-native-toast-message";
import { colorRed } from "../style/ColorPalette";

export const showToast = (error:string, text1:string, text2:string, position:any) => {
    Toast.show({
      type: error,
      text1: text1,
      text2: text2,
      visibilityTime: 4000,
      text1Style: { fontSize: 13, color: "black" },
      text2Style: { fontSize: 13, color: colorRed },
      position: position,
      bottomOffset:50
    });
  }