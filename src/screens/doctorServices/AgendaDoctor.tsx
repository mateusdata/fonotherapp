import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Modal, TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Agenda, CalendarProvider } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorPrimary } from '../../style/ColorPalette';
import dayjs from 'dayjs';
import { vibrateFeedback } from '../../utils/vibrateFeedback';

const AgendaDoctor = () => {
  const [agendaItems, setAgendaItems] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', name: '', time: '' });
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // Carregar a agenda do AsyncStorage quando o componente monta
  useEffect(() => {
    loadAgendaFromStorage();
  }, []);

  // Salvar a agenda no AsyncStorage sempre que houver alterações
  useEffect(() => {
    saveAgendaToStorage(agendaItems);
  }, [agendaItems]);

  // Função para carregar a agenda do AsyncStorage
  const loadAgendaFromStorage = async () => {
    try {
      const storedAgenda = await AsyncStorage.getItem('agendaItems');
      if (storedAgenda) {
        setAgendaItems(JSON.parse(storedAgenda));
      }
    } catch (error) {
      console.error('Erro ao carregar do AsyncStorage:', error);
    }
  };

  // Função para salvar a agenda no AsyncStorage
  const saveAgendaToStorage = async (items) => {
    try {
      await AsyncStorage.setItem('agendaItems', JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar no AsyncStorage:', error);
    }
  };

  // Função para abrir o modal ao clicar em um dia
  const handleDayPress = (day) => {
    setNewEvent({ ...newEvent, date: day.dateString });
    setModalVisible(true);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setTimePickerVisible(false);
    setNewEvent({
      ...newEvent,
      time: `${currentTime.getHours()}:${currentTime.getMinutes()}`,
    });
  };

  const openTimePicker = () => {
    setTimePickerVisible(true);
  };

  // Salvar o novo evento e fechar o modal
  const handleSaveEvent = () => {
    if (newEvent.date && newEvent.name && newEvent.time) {
      setAgendaItems((prevItems) => ({
        ...prevItems,
        [newEvent.date]: [...(prevItems[newEvent.date] || []), newEvent],
      }));
      setModalVisible(false);
      setNewEvent({ date: '', name: '', time: '' });
      vibrateFeedback()
      Alert.alert("Novo evento", "Novo evento criado com sucesso")
    } else {
      alert('Preencha todos os campos para adicionar um evento.');
    }
  };

  return (
    <View style={styles.container}>

      <CalendarProvider 
      date='2024-10-24'

      >


        <Agenda
          showClosingKnob
          items={agendaItems}
          renderItem={(item) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
          )}
          renderEmptyDate={() => (
            <View style={styles.emptyDate}>
              <Text>Sem eventos para este dia!</Text>
            </View>
          )}
          theme={{
            agendaDayTextColor: '#4A90E2',
            agendaDayNumColor: '#4A90E2',
            agendaTodayColor: '#D32F2F',
            agendaKnobColor: '#FFC107',
          }}
          onDayPress={handleDayPress}
        />
      </CalendarProvider>
      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
        <Text style={styles.modalTitle}>Novo Evento em {dayjs(newEvent.date).format("DD/MM/YYYY")}</Text>
        <TextInput
          label="Nome do Evento"
          value={newEvent.name}
          onChangeText={(text) => setNewEvent({ ...newEvent, name: text })}
          style={styles.input}
        />
        <Button buttonColor={colorPrimary} textColor='white' mode="outlined" onPress={openTimePicker} style={styles.pickerButton}>
          Selecionar Hora
        </Button>
        <Button buttonColor={colorPrimary} textColor='white' mode="contained" onPress={handleSaveEvent} style={styles.saveButton}>
          Salvar Evento
        </Button>

        {timePickerVisible && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  item: {
    backgroundColor: '#e0f7fa',
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
  },
  itemTime: {
    fontSize: 14,
    color: '#004d40',
  },
  emptyDate: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  pickerButton: {
  },
  saveButton: {
    marginTop: 10,
  },
});

export default AgendaDoctor;
