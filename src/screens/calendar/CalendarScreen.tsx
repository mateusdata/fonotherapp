import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda, CalendarProvider } from 'react-native-calendars';
import { colorPrimary } from '../../style/ColorPalette';
import ButtonEvents from '../../components/ButtonEvents';
import dayjs from 'dayjs';
import { api } from '../../config/Api';
import { useFocusEffect } from '@react-navigation/native';

const AgendaScreen = () => {
  const [items, setItems] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async (year, month) => {
    setLoading(true);
    try {
      const response = await api.post("appointments-of-the-day", {
        year,
        month,
      });

      const data = response.data;
      const formattedItems = { ...items }; // Mantém os itens já carregados
      const updatedMarkedDates = { ...markedDates }; // Mantém as datas já marcadas

      Object.keys(data).forEach((date) => {
        const appointments = data[date];

        formattedItems[date] = appointments.map((appointment) => ({
          name: appointment.title,
          time: appointment.time,
        }));

        updatedMarkedDates[date] = {
          marked: true,
          dotColor: 'orange',
        };
      });

      setItems(formattedItems);
      setMarkedDates(updatedMarkedDates);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const year = dayjs().year();
      const month = dayjs().month() + 1;
      fetchAppointments(year, month);
    }, [])
  );

  const loadItemsForMonth = (date) => {
    const year = dayjs(date.timestamp).year();
    const month = dayjs(date.timestamp).month() + 1;
    fetchAppointments(year, month);
  };

  const onDayChange = (day) => {
    console.log('Dia mudado: ', day);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.text}>{item.time}</Text>
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
      <View style={{ flex: 1, paddingBottom: 20 }}>
        <CalendarProvider testID="cal-provider" date={dayjs(new Date()).format()}>
          <Agenda
            showClosingKnob
            items={items}
            loadItemsForMonth={loadItemsForMonth}
            onDayChange={onDayChange}
            selected={dayjs().format('YYYY-MM-DD')}
            renderItem={renderItem}
            renderEmptyData={renderEmptyDate}
            markedDates={markedDates}
            theme={{
              agendaDayTextColor: '#4A90E2',
              agendaDayNumColor: '#4A90E2',
              agendaTodayColor: '#D32F2F',
              agendaKnobColor: colorPrimary,
            }}
            style={styles.agenda}
          />
        </CalendarProvider>
        <View style={{ flex: 0.34 }}>
          <ButtonEvents />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  agenda: {
    backgroundColor: '#ffffff',
  },
  item: {
    backgroundColor: '#EC4890',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    flex: 1,
    alignItems: 'center',
    top: 10,
  },
  text: {
    color: 'white',
  },
});

export default AgendaScreen;
