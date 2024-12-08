import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs'; // Certifique-se de importar dayjs

export const WelcomeNotification = async (title: string, message: string, delay: number, date?: string) => {
  // Passo 1: Solicitar permissão para notificações
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
   
    return;
  }

  // Passo 2: Configurar o manuseio de notificações
  Notifications.setNotificationHandler({
    handleNotification: async () => {
      // Faça o que quiser com a notificação recebida
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    },
  });

  // Passo 3: Converter a data recebida de string para objeto Date
  const notificationDate = dayjs(date).toDate(); // Converte a string em Date

  // Passo 4: Enviar uma notificação
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
      sound: true,
      vibrate: [10, 2000], // Vibra uma vez por 500ms
      data: { example: 'data' }
    },
    trigger: null
  });
};
