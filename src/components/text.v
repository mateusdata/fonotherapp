import React from 'react';
import { Text } from 'react-native';
import {
    useFonts, Poppins_600SemiBold, Poppins_800ExtraBold, Poppins_300Light, Poppins_400Regular,
    Poppins_500Medium, Poppins_600SemiBold_Italic, Poppins_100Thin, Poppins_900Black_Italic, Poppins_700Bold_Italic, Poppins_200ExtraLight_Italic
} from '@expo-google-fonts/poppins';


type FormatFontFamilly =
    "Poppins_600SemiBold" | "Poppins_800ExtraBold" | "Poppins_300Light" | "Poppins_400Regular" | "Poppins_500Medium" |
    "Poppins_600SemiBold_Italic" | "Poppins_100Thin" | "Poppins_900Black_Italic" | "Poppins_700Bold_Italic" | "Poppins_200ExtraLight_Italic"

export default function Text(props: { fontFamily?: FormatFontFamilly, style: any, children: any }) {
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold, Poppins_800ExtraBold, Poppins_300Light, Poppins_400Regular, Poppins_500Medium,
        Poppins_600SemiBold_Italic, Poppins_100Thin, Poppins_900Black_Italic, Poppins_700Bold_Italic, Poppins_200ExtraLight_Italic
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Text style={{ ...props.style, fontFamily: props.fontFamily || 'Poppins_300Light' }}>
            {props.children}
        </Text>
    );
}
