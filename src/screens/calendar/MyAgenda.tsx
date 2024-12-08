import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable, RefreshControl, Alert, Text } from 'react-native';
import { List, Divider, Searchbar, IconButton } from 'react-native-paper';
import { api } from '../../config/Api';
import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import LoadingComponent from '../../components/LoadingComponent';
import utc from 'dayjs/plugin/utc';
import NotFoudMessageList from '../../components/NotFoudMessageList';
import { useFocusEffect } from '@react-navigation/native';
import { showToast } from '../../utils/showToast';

dayjs.extend(utc);

export default function MyAppointments({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchAppointments(reset = false) {
    if (isLoading || (!reset && !hasMore)) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/appointments/?page=${reset ? 1 : page}&pageSize=10`);
      const newAppointments = response.data.data;

      if (reset) {
        // Reseta a lista ao atualizar
        setAppointments(newAppointments);
        setPage(2); // Próxima página será a 2
      } else {
        setAppointments(prevAppointments => [...prevAppointments, ...newAppointments]);
        setPage(prevPage => prevPage + 1);
      }

      if (newAppointments.length === 0) {
        setHasMore(false);
      } else if (reset) {
        setHasMore(true);
      }

    } catch (error) {
      if (error.response?.status === 404) {
        setHasMore(false);
        setIsEmpty(true);
      } else {
        console.error('Erro ao buscar os relatórios:', error);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAppointments(true); // Reseta a lista quando a tela é focada
    }, [])
  );

  const filteredAppointments = appointments.filter(appointment =>
    appointment.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderFooter = () => {
    if (!isLoading || refreshing) return null;
    return <LoadingComponent />;
  };

  const handleProfile = (event) => {
    navigation.navigate('EditEventScreen', { event });
  };

  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      fetchAppointments();
    }
  };

  async function handleRefresh() {
    setRefreshing(true);
    setIsEmpty(false);
    await fetchAppointments(true); // Reseta ao atualizar
  }

 

  async function handleDelete(eventId) {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja excluir este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true)
              await api.delete(`/appointment/${eventId}`);
              setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.app_id !== eventId)
              );
              showToast({
                type: "success",
                text1: "Evento excluído.",
                position: "bottom"
              });
              
              setIsLoading(false)

              handleRefresh()
            } catch (error) {
              console.error('Erro ao excluir o evento:', error);
              Alert.alert('Erro', 'Não foi possível excluir o evento.');
              setIsLoading(false)
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        onChangeText={setSearch}
        value={search}
        placeholder="Pesquisar eventos"
        mode="bar"
        inputMode="search"
        selectionColor="gray"
        cursorColor="gray"
        style={{ marginBottom: 10 }}
      />

      {!filteredAppointments?.length && !isLoading &&
        <Text style={{ textAlign: "center" }}>
          Nenhum moral encontrado.
        </Text>}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.app_id.toString()}
          onEndReached={handleEndReached}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => {
            const date = dayjs.utc(item.starts_at);
            return (
              <Pressable

                onPress={() => handleProfile(item)}
                key={item.app_id}
              >
                <List.Item
                  title={item.title}
                  description={`${date.format('ddd, D [de] MMM [de] YYYY')} - ${date.format('HH:mm')}`}
                  left={(props) => <List.Icon {...props} icon="calendar" />}
                  right={() => (
                    <IconButton
                      icon="delete"
                      onPress={() => handleDelete(item.app_id)}
                      style={{ marginRight: 0 }}
                      iconColor="#d32f2f"
                    />
                  )}
                />
                <Divider />
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  pressable: {
    right: 15,
  },
  listContainer: {
    flexGrow: 1,
    width: '100%',
    borderWidth: 0,
  },
});
