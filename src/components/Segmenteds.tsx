import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { colorPrimary } from '../style/ColorPalette';

const Segmenteds = () => {
  const [value, setValue] = React.useState('Categoria1');

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'Categoria1',
            label: 'Categoria1',
            checkedColor: 'white',
            style: value === 'Categoria1' ? styles.selectedButton : styles.button,
          },
          {
            value: 'Categoria2',
            label: 'Categoria2',
            checkedColor: 'white',
            style: value === 'Categoria2' ? styles.selectedButton : styles.button,
          },
          {
            value: 'Categoria3',
            label: 'Categoria3',
            checkedColor: 'white',
            style: value === 'Categoria3' ? styles.selectedButton : styles.button,
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
