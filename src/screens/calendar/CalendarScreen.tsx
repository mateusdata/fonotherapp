import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Agenda, CalendarProvider } from 'react-native-calendars';
import { colorPrimary } from '../../constants/ColorPalette';
import ButtonEvents from '../../components/ButtonEvents';
import dayjs from 'dayjs';
import { api } from '../../config/Api';
import { useFocusEffect } from '@react-navigation/native';
import '../../utils/calendarConfig';

const AgendaScreen = () => {
  const [items, setItems] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [loadedMonths, setLoadedMonths] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Função para buscar compromissos do mês e atualizar os dados da agenda
  const fetchAppointments = async (year, month) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Função que carrega eventos para o mês selecionado se ainda não tiver sido carregado
  const loadItemsForMonth = useCallback(({ year, month }) => {
    const monthsToLoad = [0, 1, 2, 3, 4];

    monthsToLoad.forEach(offset => {
      const loadMonth = month + offset;
      const loadYear = year + Math.floor((month - 1 + offset) / 12);

      const adjustedMonth = (loadMonth % 12) || 12;
      const monthYearKey = `${loadYear}-${adjustedMonth}`;

      if (!loadedMonths.has(monthYearKey)) {
        fetchAppointments(loadYear, adjustedMonth);
        setLoadedMonths(prevLoadedMonths => new Set(prevLoadedMonths).add(monthYearKey));
      }
    });
  }, [loadedMonths]);

  // Função para atualizar ao deslizar para baixo
  const onRefresh = async () => {
    setRefreshing(true);
    const year = dayjs().year();
    const month = dayjs().month() + 1;
    await fetchAppointments(year, month);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      const year = dayjs().year();
      const month = dayjs().month() + 1;
      loadItemsForMonth({ year, month });
    }, [loadItemsForMonth])
  );

  const renderItem = (item) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.name}</Text>
      <Text style={styles.text}>{item.time}</Text>
    </View>
  );

  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      {loading ? (
        <ActivityIndicator size="large" color={colorPrimary} />
      ) : (
        <Text>Sem eventos para hoje</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor:"#F3F4F6" }}>
      <CalendarProvider testID="cal-provider" date={dayjs().format()}>
        <Agenda
          showClosingKnob={false}
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
          disabledByDefault={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          style={styles.agenda}
        />
      </CalendarProvider>
      <View style={{ flex: 0.2, backgroundColor:"#F3F4F6" }}>
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
