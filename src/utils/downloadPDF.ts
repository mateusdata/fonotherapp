import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import { vibrateFeedback } from "./vibrateFeedback";
import { set } from "react-hook-form";

export default async function downloadPDF(pdfUri: string, pdfName: string, token: string, setLoading: any) {
    try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1))
        const fileUri = FileSystem.documentDirectory + pdfName
      
        const downloadResumable = FileSystem.createDownloadResumable(
            pdfUri,
            fileUri,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            },

        )

        const downloadResponse = await downloadResumable.downloadAsync()

        if (downloadResponse?.uri) {
            vibrateFeedback()
            await fileSave(downloadResponse?.uri, pdfName)
        }
        setLoading(false)

    } catch (error) {
        Alert.alert("Download", "Não foi possível realizar o download.")
        console.error(error)
        setLoading(false)
        alert("Ocorreu um error")

    }
}

export async function fileSave(uri: string, filename: string) {
    if (Platform.OS === "android") {
        const directoryUri = FileSystem.cacheDirectory + filename
        const base64File = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        })

        await FileSystem.writeAsStringAsync(directoryUri, base64File, {
            encoding: FileSystem.EncodingType.Base64,
        })
        await Sharing.shareAsync(directoryUri)
    } else {
        Sharing.shareAsync(uri)
    }
}


function onDownloadProgress({
    totalBytesWritten,
    totalBytesExpectedToWrite,
}: FileSystem.DownloadProgressData) {
    const percentage = (totalBytesWritten / totalBytesExpectedToWrite) * 100
    //setProgressPercentage(percentage)
}
