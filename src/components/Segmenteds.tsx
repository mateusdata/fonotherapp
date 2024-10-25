import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

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
          },
          {
            value: 'Categoria2',
            label: 'Categoria2',
          },
          { value: 'Categoria3', label: 'Categoria3' },
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
});

export default Segmenteds;