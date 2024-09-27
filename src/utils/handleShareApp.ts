import { Share } from "react-native";

export const handleShareApp = async () => {
    try {
      await Share.share({
        message: '🎉 Olá amigos, venham conferir este super aplicativo de fonoaudiologia para médicos: 📱 https://fonotherapp.vercel.app/ 🎉',
        url: "https://fonotherapp.vercel.app/",
      });
    } catch (error) {
    }
  };