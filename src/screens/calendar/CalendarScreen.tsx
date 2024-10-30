import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda, CalendarProvider } from 'react-native-calendars';
import { colorPrimary } from '../../style/ColorPalette';
import ButtonEvents from '../../components/ButtonEvents';
import { api } from '../../config/Api';
import dayjs from 'dayjs';
import '../../utils/calendarConfig';

const AgendaScreen = () => {
  const [items, setItems] = useState({});
  const [markedDates, setMarkedDates] = useState({}); // Estado para as datas marcadas
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    try {
      const response = await api.get("/appointments");
      console.log('Response from API:', response.data);
      const { formattedItems, markedDates } = makeDates(response.data.data);
      setItems(formattedItems);
      setMarkedDates(markedDates); // Atualiza o estado com as datas marcadas
    } catch (error) {
      console.error(error);
    }
  }

  // Função para formatar as datas
  const makeDates = (appointments) => {
    const formattedItems = {};
    const markedDates = {};

    if (Array.isArray(appointments)) {
      appointments.forEach((item) => {
        const date = item.time.split('T')[0]; // Obtém a data no formato 'YYYY-MM-DD'

        // Adiciona o compromisso ao objeto de itens
        if (!formattedItems[date]) {
          formattedItems[date] = [];
        }
        formattedItems[date].push({ name: item.title }); // Adiciona o título ao array da data correspondente

        // Adiciona a data ao objeto de datas marcadas
        markedDates[date] = {
          marked: true, // Marca a data
          dotColor: 'orange', // Cor do ponto

        };
      });
    } else {
      console.error('Expected appointments to be an array but got:', appointments);
    }

    console.log('Formatted items:', formattedItems);
    console.log('Marked dates:', markedDates); // Log para verificar a estrutura das datas marcadas
    return { formattedItems, markedDates };
  }

  useEffect(() => {
    fetchData();
  }, []);

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
      <View style={{flex:1, paddingBottom:20,}}>
        <CalendarProvider date={dayjs(new Date()).format()}>
          <Agenda
            items={items}
            loadItemsForMonth={loadItemsForMonth}
            onDayChange={onDayChange}
            selected={new Date()}
            renderItem={renderItem}
            renderEmptyData={renderEmptyDate}
            markedDates={markedDates} // Passar aqui
           
            style={styles.agenda}
          />
        </CalendarProvider>
      </View>
      <ButtonEvents />
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
    top: 10,
  },
});

export default AgendaScreen;
