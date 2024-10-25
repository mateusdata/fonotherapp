import { Share } from "react-native";

export const handleShareApp = async () => {
    try {
      await Share.share({
        message: '🎉 Olá amigos, venham conferir este super aplicativo de fonoaudiologia para médicos: 📱 https://fonotherApp.vercel.app/ 🎉',
        url: "https://fonotherApp.vercel.app/",
      });
    } catch (error) {
    }
  };