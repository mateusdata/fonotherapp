import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { Provider as PaperProvider, Text, Button, TextInput, List, Divider, Modal, Portal } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colorPrimary } from '../../style/ColorPalette';

const App = () => {
  const [notices, setNotices] = useState<{ id: string; title: string; date: string }[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Você precisa permitir notificações para usar este recurso.');
      }
    };
    getPermissions();
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const savedNotices = await AsyncStorage.getItem('notices');
      if (savedNotices) {
        setNotices(JSON.parse(savedNotices));
      }
    } catch (error) {
      console.error("Erro ao carregar os avisos: ", error);
    }
  };

  const handleAddNotice = async () => {
    if (!title || !dateString) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const newNotice = { id: Date.now().toString(), title, date: dateString };
    const updatedNotices = [...notices, newNotice];

    setNotices(updatedNotices);
    await AsyncStorage.setItem('notices', JSON.stringify(updatedNotices));
    scheduleNotification(newNotice);
    setTitle('');
    setDate(new Date());
    setDateString('');
    setModalVisible(false);
  };

  const handleRemoveNotice = async (id: string) => {
    const updatedNotices = notices.filter(notice => notice.id !== id);
    setNotices(updatedNotices);
    await AsyncStorage.setItem('notices', JSON.stringify(updatedNotices));
  };

  const scheduleNotification = async (notice: { id: string; title: string; date: string }) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Novo Aviso',
        body: `${notice.title} - ${notice.date}`,
      },
      trigger: { date: new Date(notice.date) },
    });
  };

  const renderItem = ({ item }: { item: { id: string; title: string; date: string } }) => (
    <View style={{ borderWidth: 1, borderColor: colorPrimary, borderRadius: 12 }}>
      <List.Item
        title={item.title}
        description={item.date}
        right={() => (
          <Pressable style={{ justifyContent: "center", alignItems: "center" }} android_ripple={{ color: colorPrimary }} onPress={() => handleRemoveNotice(item.id)}>
            <Text style={styles.removeText}>Remover</Text>
          </Pressable>
        )}
      />
      <Divider />
    </View>
  );

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setDateString(currentDate.toISOString());
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    showTimePickerModal();
    if (event.type === 'set') {
      const currentTime = selectedTime || date;
      const updatedDate = new Date(date);
      updatedDate.setHours(currentTime.getHours());
      updatedDate.setMinutes(currentTime.getMinutes());
      setDate(updatedDate);
      setDateString(updatedDate.toISOString());
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
        />

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <TextInput
              mode='outlined'
              activeOutlineColor={colorPrimary}
              label="Título do Aviso"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TouchableOpacity onPress={showDatePickerModal}>
              <TextInput
                mode='outlined'
                activeOutlineColor={colorPrimary}
                label="Data do Aviso"
                value={dateString ? new Date(dateString).toLocaleString() : ''}
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={showTimePickerModal}>
              <TextInput
                mode='outlined'
                activeOutlineColor={colorPrimary}
                label="Hora do Aviso"
                value={dateString ? new Date(dateString).toLocaleTimeString() : ''}
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onDateChange}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onTimeChange}
              />
            )}

            <Button
              mode="contained"
              onPress={handleAddNotice}
              style={styles.addButton}>
              Adicionar Aviso
            </Button>
            <Button mode="text" textColor={colorPrimary} onPress={() => setModalVisible(false)}>
              Cancelar
            </Button>
          </Modal>
        </Portal>

        <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: colorPrimary,
  },
  removeText: {
    color: 'red',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: colorPrimary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    lineHeight: 28,
  },
});

export default App;
