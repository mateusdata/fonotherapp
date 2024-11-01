import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, RefreshControl, Text } from 'react-native';
import { List, Divider, Searchbar } from 'react-native-paper';
import { api } from '../../config/Api';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import LoadingComponent from '../../components/LoadingComponent';
import utc from 'dayjs/plugin/utc';
import NotFoudMessageList from '../../components/NotFoudMessageList';
import { useFocusEffect } from '@react-navigation/native';
import { colorPrimary } from '../../style/ColorPalette';

dayjs.extend(utc);

export default function FinanceScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchAppointments() {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/appointments/?page=${page}&pageSize=10`);
      const newAppointments = response.data.data;

      if (newAppointments.length === 0) {
        setHasMore(false);
      } else {
        setAppointments(prevAppointments => [...prevAppointments, ...newAppointments]);
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

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  const filteredAppointments = appointments.filter(appointment =>
    appointment.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return <LoadingComponent />;
  };

  const handleProfile = (event) => {
    navigation.navigate('EditEventScreen', { event });
  };

  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  async function handleRefresh() {
    setRefreshing(true);
    setAppointments([]); // Limpa a lista antes de carregar novos dados
    setPage(1); // Redefine a página para o valor inicial
    setIsEmpty(false); // Garante que a mensagem "Not Found" não seja exibida durante o refresh
  }

  if (isEmpty) {
    return <NotFoudMessageList />;
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
                style={styles.pressable}
                onPress={() => handleProfile(item)}
                key={item.app_id}
              >
                <List.Item
                  title={item.title}
                  description={`${date.format('ddd, D [de] MMM [de] YYYY')} - ${date.format('HH:mm')}`}
                  left={(props) => <List.Icon {...props} icon="calendar" />}
                />
                <Divider />
              </Pressable>
            );
          }}
        />

        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("AddNotiecBoardScreen.tsx")}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
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
  buttonText: {
    color: 'white',
    fontSize: 28,
    lineHeight: 28,
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
});
