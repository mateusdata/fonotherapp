import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Modal, TextInput } from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorPrimary } from '../../style/ColorPalette';

const AgendaDoctor = () => {
  const [agendaItems, setAgendaItems] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '2024-10-20', name: 'Consulta de rotina', time: '10:30 AM' });

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

  // Renderizar cada item da agenda
  const renderItem = (item) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemTime}>{item.time}</Text>
    </View>
  );

  // Renderizar quando não houver eventos para uma data
  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text>Sem eventos para este dia!</Text>
    </View>
  );

  // Abrir o modal para adicionar um novo evento
  const handleAddEvent = () => {
    setModalVisible(true);
  };

  // Salvar o novo evento e fechar o modal
  const handleSaveEvent = () => {
    if (newEvent.date && newEvent.name && newEvent.time) {
      setAgendaItems((prevItems) => {
        const updatedItems = { ...prevItems };
        if (!updatedItems[newEvent.date]) {
          updatedItems[newEvent.date] = [];
        }
        updatedItems[newEvent.date].push(newEvent);
        return updatedItems;
      });
      setModalVisible(false);
      setNewEvent({ date: '2024-10-21', name: '', time: '' });
    } else {
      alert('Preencha todos os campos para adicionar um evento.');
    }
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={agendaItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        theme={{
          agendaDayTextColor: '#4A90E2',
          agendaDayNumColor: '#4A90E2',
          agendaTodayColor: '#D32F2F',
          agendaKnobColor: '#FFC107',
        }}
      />
      <Button
        mode="contained"
        buttonColor={colorPrimary}
        onPress={handleAddEvent}
        style={styles.addButton}
      >
        Adicionar Novo Evento
      </Button>

      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
        <Text style={styles.modalTitle}>Novo Evento</Text>
        <TextInput
          label="Data (YYYY-MM-DD)"
          value={newEvent.date}
          onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
          style={styles.input}
        />
        <TextInput
          label="Nome do Evento"
          value={newEvent.name}
          onChangeText={(text) => setNewEvent({ ...newEvent, name: text })}
          style={styles.input}
        />
        <TextInput
          label="Hora (HH:MM AM/PM)"
          value={newEvent.time}
          onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSaveEvent} style={styles.saveButton}>
          Salvar Evento
        </Button>
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
  addButton: {
    margin: 20,
    borderRadius: 5,
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
  saveButton: {
    marginTop: 10,
    borderRadius: 5,
  },
});

export default AgendaDoctor;
