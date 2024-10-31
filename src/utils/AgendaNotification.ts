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

  
  const notificationDate = dayjs(date).toDate(); 

  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
      sound: true,
      vibrate: [10, 2000], 
      data: { example: 'data' }
    },
    trigger: {
      
      date: notificationDate, 
    },
  });
};
