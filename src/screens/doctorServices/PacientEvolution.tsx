import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid, Platform, Pressable } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { api } from '../../config/Api';
import { colorPrimary, colorRed } from '../../style/ColorPalette';
import { vibrateFeedback } from '../../utils/vibrateFeedback';
import AntDesign from '@expo/vector-icons/AntDesign';
export default function PacientEvolution({ route, navigation }) {
  const { pac_id } = route.params; // Recebe o pac_id passado pela navegação
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }
  };

  // Função para salvar o comentário de evolução
  const handleSave = async () => {
    if (!text) {
      alert("Por favor, preencha o campo de evolução.");
      return;
    }

    const evolution = {
      pac_id,
      comment: text,
      date: dayjs(date).format("YYYY-MM-DD"), // Formata a data no formato correto
    };

    setLoading(true);

    try {
      // Chama a API para salvar a evolução
      await api.post("record", evolution);

      setText('');
      vibrateFeedback()
      if (Platform.OS === "android") {
        ToastAndroid.show("Evolução diária salva!", ToastAndroid.BOTTOM);
      } else {
        alert("Evolução diária salva!");
      }
    } catch (error) {
      console.error("Erro ao salvar a evolução diária:", error);
      alert("Ocorreu um erro ao salvar a evolução diária.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%", alignItems: "flex-start" }}>
          <Text style={styles.title}>Evolução Diária</Text>
          <Pressable android_ripple={{ color: colorPrimary }} style={{ backgroundColor: "white", padding: 7 }} onPress={() => navigation.navigate("ListPacientEvolution", { pac_id: pac_id })}>
            <AntDesign name="eye" size={24} color={colorPrimary} />
          </Pressable>
        </View>
        {Platform.OS === "android" && <Button mode="outlined" textColor={colorPrimary} onPress={() => setShowDatePicker(true)}>
          {dayjs(date).format('DD/MM/YYYY')}
        </Button>}


        {

          Platform.OS === "ios" ?
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "default" : "default"}
              onChange={onDateChange}
              minimumDate={new Date()}
            />

            :
            false && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )

        }


        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          autoFocus
          numberOfLines={8}
          style={styles.textInput}
        />

        <Button
          mode="outlined"
          textColor="white"
          buttonColor={colorPrimary}
          onPress={handleSave}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Salvar
        </Button>
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
    maxHeight: 200,
    minHeight: 200
  },
  button: {
    marginTop: 16,
  },
});
