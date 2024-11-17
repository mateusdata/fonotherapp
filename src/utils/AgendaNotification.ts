import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';

export const AgendaNotification = async (title: string, message: string, delay: number, date: string) => {
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Falha ao obter permissão para notificações!');
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    },
  });

  // Converte a string 'date' para um objeto dayjs
  const parsedDate = dayjs(date);

  // Cria uma nova data, mantendo apenas a hora e os minutos (ignorando os segundos)
  const notificationDate = parsedDate
    .minute(parsedDate.minute()) // Garantir que seja o minuto correto
    .second(0) // Zera os segundos
    .millisecond(0); // Zera os milissegundos também

  // A notificação agora inclui o tipo "DATE" no trigger
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
      sound: true,
      vibrate: [10, 2000],
      data: { example: 'data' }
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE, // Aqui adicionamos o tipo "DATE"
      date: notificationDate.toDate(), // Usa a data ajustada
    },
  });
};
