import * as Haptics from 'expo-haptics';

export const handleHapticFeedback = () => {
  Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
  )
};