import * as Haptics from 'expo-haptics';

export const vibrateFeedbackWarning = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
};