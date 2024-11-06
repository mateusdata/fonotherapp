import React, { useCallback, useState } from 'react';
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

  async function fetchAppointments(reset = false) {
    if (isLoading || (!reset && !hasMore)) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/reminders/?page=${reset ? 1 : page}&pageSize=10`);
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
      fetchAppointments(true);
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
    navigation.navigate('EditNoticeBoardScreen', { event });
  };

  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      fetchAppointments();
    }
  };

  async function handleRefresh() {
    setRefreshing(true);
    setIsEmpty(false);
    await fetchAppointments(true);
  }

  if (isEmpty) {
    return (
      <View style={{flex:1, justifyContent:'space-between'}}>
        <NotFoudMessageList />
        <TouchableOpacity style={[styles.floatingButton2]} onPress={() => navigation.navigate("AddNoticeBoardScreen")}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Searchbar
        onChangeText={setSearch}
        value={search}
        placeholder="Pesquisar mural"
        mode="bar"
        inputMode="search"
        selectionColor="gray"
        cursorColor="gray"
        style={{ marginBottom: 10 }}
      />
      <View style={styles.listContainer}>
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.rem_id.toString()}
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
                key={item.rem_id}
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

        <Pressable style={styles.floatingButton} onPress={() => navigation.navigate("AddNoticeBoardScreen")}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
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
    bottom: 80,
    right: 10,
    width: 56,
    height: 56,
    backgroundColor: colorPrimary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  floatingButton2: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    margin:10,
    width: 56,
    height: 56,
    backgroundColor: colorPrimary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
