import { BaseToast } from "react-native-toast-message";
import { colorPrimary, colorRed } from "../style/ColorPalette";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green",
        backgroundColor: "#388E3C",
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 13,
        color: 'white',
        textAlign: 'center',
      }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "red",
        backgroundColor: colorRed,
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
      }}
      text2Style={{
        fontSize: 13,
        color: 'white',
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green",
        backgroundColor: "#388E3C",
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
      }}
      text2Style={{
        fontSize: 13,
        color: 'white',
      }}
    />
  ),
};
