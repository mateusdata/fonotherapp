import React, { useCallback, useState } from 'react';
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
  const [loadedMonths, setLoadedMonths] = useState(new Set());

  // Função para buscar compromissos do mês e atualizar os dados da agenda
  const fetchAppointments = async (year, month) => {
    try {
      const response = await api.post("appointments-of-the-day", { year, month });
      const data = response.data;

      const formattedItems = {};
      const updatedMarkedDates = {};

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

      setItems((prevItems) => ({ ...prevItems, ...formattedItems }));
      setMarkedDates((prevDates) => ({ ...prevDates, ...updatedMarkedDates }));
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  // Função que carrega eventos para o mês selecionado se ainda não tiver sido carregado
  const loadItemsForMonth = useCallback(({ year, month }) => {
    if (!loadedMonths.has(`${year}-${month}`)) {
      fetchAppointments(year, month);
      setLoadedMonths((prevLoadedMonths) => new Set(prevLoadedMonths).add(`${year}-${month}`));
    }
  }, [loadedMonths]);

  // Carrega eventos do mês atual sempre que a tela for focada
  useFocusEffect(
    useCallback(() => {
      const year = dayjs().year();
      const month = dayjs().month() + 1;
      loadItemsForMonth({ year, month });
    }, [loadItemsForMonth])
  );

  // Renderiza cada item do compromisso na agenda
  const renderItem = (item) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.name}</Text>
      <Text style={styles.text}>{item.time}</Text>
    </View>
  );

  // Renderiza a mensagem para dias sem eventos
  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text>Sem eventos para hoje</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <CalendarProvider testID="cal-provider" date={dayjs().format()}>
        <Agenda
          showClosingKnob
          items={items}
          selected={dayjs().format('YYYY-MM-DD')}
          loadItemsForMonth={loadItemsForMonth}
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
