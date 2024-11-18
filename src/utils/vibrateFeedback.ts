import * as Haptics from 'expo-haptics';

export const vibrateFeedback = () => {
  Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
  )
};