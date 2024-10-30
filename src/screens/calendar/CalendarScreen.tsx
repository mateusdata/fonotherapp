import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { colorPrimary } from '../../style/ColorPalette';
import ButtonEvents from '../../components/ButtonEvents';

const AgendaScreen = () => {
  const [items, setItems] = useState({
    '2024-10-29': [
      { name: 'Evento 1 - Hoje', height: 50 },
      { name: 'Evento 2 - Hoje', height: 50 },
    ],
    '2024-10-31': [
      { name: 'Evento 3 - Amanhã', height: 50 },
    ],

  });

  const [loading, setLoading] = useState(false);

  const loadItemsForMonth = (month) => {
    console.log('Trigger items loading for month: ', month);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const onDayChange = (day) => {
    console.log('Day changed: ', day);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
      </View>
    );
  };

  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text>Sem eventos para hoje</Text>
    </View>
  );


  return (
    <View style={{ flex: 1 }}>
      <Agenda

        items={items}
        loadItemsForMonth={loadItemsForMonth}
        onDayChange={onDayChange}
        selected={'2024-10-29'}
        renderItem={renderItem}
        renderEmptyData={renderEmptyDate}
        markedDates={{
          '2024-10-29': { selected: true, marked: true },
          '2024-10-30': { marked: true },
          '2024-10-31': { marked: true },
          '2024-10-28': { marked: true },
        }}
        theme={{
          agendaDayTextColor: 'yellow',
          agendaDayNumColor: 'green',
          agendaTodayColor: 'red',
          agendaKnobColor: colorPrimary,
        }}
        style={styles.agenda}
      />

     <ButtonEvents/>
    </View>
  );
};

const styles = StyleSheet.create({
  agenda: {
    backgroundColor: '#ffffff',
  },
  item: {
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    flex: 1,
    alignItems: "center",
    top: 10
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AgendaScreen;
