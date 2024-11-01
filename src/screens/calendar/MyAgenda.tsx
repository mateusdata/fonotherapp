import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { List, Divider, Searchbar } from 'react-native-paper';
import { api } from '../../config/Api';
import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import LoadingComponent from '../../components/LoadingComponent';
import utc from 'dayjs/plugin/utc';
import NotFoudMessageList from '../../components/NotFoudMessageList';
import { useFocusEffect } from '@react-navigation/native';
dayjs.extend(utc);

export default function MyAppointments({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false)
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
        setIsEmpty(true)
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







  useEffect(() => {
    const results = appointments.filter(appointment =>
      appointment.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAppointments(results);
    console.log(results);

  }, [search, appointments]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return <LoadingComponent />;
  };

  const handleProfile = (event: any) => {
    navigation.navigate('EditEventScreen', { event });
  };

  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  async function handleRefresh() {
    fetchAppointments()
    setRefreshing(true);
  }
  if (isEmpty) {
    return <NotFoudMessageList />
  }
  return (
    <View style={styles.container}>
      <Searchbar
        onChangeText={setSearch}
        value={search}
        placeholder="Pesquisar eventos"
        mode='bar'
        inputMode='search'
        selectionColor={"gray"}
        cursorColor={"gray"}
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
            // Cria um objeto dayjs em UTC
            const date = dayjs.utc(item.starts_at);
            return (
              <Pressable
                style={styles.pressable}
                onPress={() => handleProfile(item)}
                key={item.app_id}>
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
