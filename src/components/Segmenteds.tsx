import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { colorPrimary } from '../constants/ColorPalette';

const Segmenteds = ({setVideosType, videosType, }:{setVideosType?:any, videosType: any}) => {

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={videosType}
        onValueChange={setVideosType}
        buttons={[
          {
            value: 'degluticao',
            label: 'Deglutição',
            checkedColor: 'white',
            style: videosType === 'degluticao' ? styles.selectedButton : styles.button,
          },
          {
            value: 'mimica_facial',
            label: 'Mímica facial',
            checkedColor: 'white',
            style: videosType === 'mimica_facial' ? styles.selectedButton : styles.button,
          },
          {
            value: 'manobras',
            label: 'Manobras',
            checkedColor: 'white',
            style: videosType === 'manobras' ? styles.selectedButton : styles.button,
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: colorPrimary,
  },
});

export default Segmenteds;
