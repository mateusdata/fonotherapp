import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, List, Divider } from 'react-native-paper';
import { colorPrimary } from '../../style/ColorPalette';

const AccessHistoryFitice = [
  { id: '1', data: '25/09/2024', hora: '14:32', local: 'São Paulo, Brasil' },
  { id: '2', data: '24/09/2024', hora: '09:15', local: 'Rio de Janeiro, Brasil' },
  { id: '3', data: '23/09/2024', hora: '19:45', local: 'Belo Horizonte, Brasil' },
  { id: '4', data: '22/09/2024', hora: '07:20', local: 'Curitiba, Brasil' },
];

export default function AccessHistory() {
  const handleClearHistory = () => {
    console.log('Histórico Limpo');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Acesso</Text>
      <View style={styles.listContainer}>
        {AccessHistoryFitice.map((item) => (
          <View key={item.id}>
            <List.Item
              title={`Data: ${item.data}`}
              description={`Hora: ${item.hora} - Local: ${item.local}`}
              left={(props) => <List.Icon {...props} icon="history" />}
            />
            <Divider />
          </View>
        ))}
      </View>
      <Button
        mode="contained"
        onPress={handleClearHistory}
        style={styles.button}
        buttonColor={colorPrimary}
      >
        Limpar Histórico
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  button: {
    marginTop: 20,
    padding: 10,
  },
});
