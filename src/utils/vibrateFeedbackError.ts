import * as Haptics from 'expo-haptics';

export const vibrateFeedbackError = () => {
  Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Error
  )
};