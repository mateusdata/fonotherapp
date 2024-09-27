import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, Divider, Button } from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import { colorPrimary } from '../../style/ColorPalette';

const agendaItems = {
  '2024-09-25': [{ name: 'Reunião com Felipe', time: '10:00 AM' }],
  '2024-09-26': [{ name: 'Almoço com Flavia, Flavia vai pagar a conta', time: '12:00 PM' }],
  '2024-09-27': [],
  '2024-09-28': [{ name: 'Conferência com amanda', time: '09:00 AM' }],
};

const AgendaDoctor = () => {
  const renderItem = (item: { name: string; time: string }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Text>{item.time}</Text>
    </View>
  );

  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text>Sem eventos para este dia!</Text>
    </View>
  );

  const handleAddEvent = () => {
    console.log('Adicionar novo evento');
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={agendaItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        theme={{
          agendaDayTextColor: 'blue',
          agendaDayNumColor: 'green',
          agendaTodayColor: 'red',
          agendaKnobColor: 'yellow',
        }}
      />
      <Button mode="contained" buttonColor={colorPrimary} onPress={handleAddEvent} style={styles.addButton}>
        Adicionar Novo Evento
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
  },
  emptyDate: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  addButton: {
    margin: 20,
  },
});

export default AgendaDoctor;
