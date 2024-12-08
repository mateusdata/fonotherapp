import Toast from "react-native-toast-message";
import { colorRed } from "../style/ColorPalette";

// Interface para os tipos de Toast
interface ToastOptions {
  type: "error" | "info" | "success";
  text1: string;
  text2?: string;
  position?: "bottom" | "top";
  visibilityTime?: number;
  bottomOffset?: number
}

export const showToast = ({ type, text1, text2, position, visibilityTime, bottomOffset }: ToastOptions) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    visibilityTime: visibilityTime ? visibilityTime : 2000,
    position: position ? position : 'bottom',
    bottomOffset: bottomOffset ? bottomOffset: 35,
        
  });
};
