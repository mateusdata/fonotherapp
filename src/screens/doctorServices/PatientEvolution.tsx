import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid, Platform } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { api } from '../../config/Api';

export default function PatientEvolution() {
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState('');
  const [previousEvolutions, setPreviousEvolutions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setShowDatePicker(false);
      setDate(currentDate);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleSave = async () => {
    if (!text) {
      alert("Por favor, preencha o campo de evolução.");
      return;
    }

    const evolution = {
      date: dayjs(date).format("YYYY-MM-DD"),
      text
    };

    try {
      await api.post("paciente-evolution", evolution);

      setPreviousEvolutions([evolution, ...previousEvolutions]);
      setText('');

      if (Platform.OS === "android") {
        ToastAndroid.show("Evolução diária salva!", ToastAndroid.BOTTOM);
      } else {
        alert("Evolução diária salva!");
      }
    } catch (error) {
      console.error("Erro ao salvar a evolução diária:", error);
      alert("Ocorreu um erro ao salvar a evolução diária.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Evolução Diária</Text>

        <Button mode="outlined" onPress={() => setShowDatePicker(true)}>
          {dayjs(date).format('DD/MM/YYYY')}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <TextInput
          label="Evolução Diária"
          value={text}
          onChangeText={setText}
          multiline
          autoFocus
          numberOfLines={8}
          style={styles.textInput}
        />

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Salvar
        </Button>

        {previousEvolutions.map((evolution, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Text style={styles.cardDate}>{evolution.date}</Text>
              <Text>{evolution.text}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInput: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    maxHeight:200
  },
  button: {
    marginTop: 16,
  },
  card: {
    marginTop: 16,
  },
  cardDate: {
    fontWeight: 'bold',
  },
});
