import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, TextInput, List, Divider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';

const NoticeBoard = () => {
  const [notices, setNotices] = useState<{ id: string; title: string; date: string }[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Você precisa permitir notificações para usar este recurso.');
      }
    };
    getPermissions();
  }, []);

  const handleAddNotice = () => {
    const newNotice = { id: Date.now().toString(), title, date };
    setNotices([...notices, newNotice]);
    scheduleNotification(newNotice);
    setTitle('');
    setDate('');
  };

  const handleRemoveNotice = (id: string) => {
    setNotices(notices.filter(notice => notice.id !== id));
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
    <View>
      <List.Item
        title={item.title}
        description={item.date}
        right={() => <Button onPress={() => handleRemoveNotice(item.id)}>Remover</Button>}
      />
      <Divider />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="Título do Aviso"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Data do Aviso (AAAA-MM-DD HH:MM)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddNotice} style={styles.button}>
        Adicionar Aviso
      </Button>
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
});

export default NoticeBoard;
