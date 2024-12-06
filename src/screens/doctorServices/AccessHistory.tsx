import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { api } from '../../config/Api';
import { Context, useAuth } from '../../context/AuthProvider';
import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import LoadingComponent from '../../components/LoadingComponent';
import { ContextPacient } from '../../context/PacientContext';
import NotFoudMessageList from '../../components/NotFoudMessageList';

export default function AccessHistory({ navigation }) {
  const { user } = useAuth();
  const { setPac_id } = useContext(ContextPacient);
  const [sessionsHistory, setSessionsHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchSessions(reset = false) {
    if (isLoading && !reset) return;
    setIsLoading(true);
    try {
      const response = await api.get(`last-appointents/${user?.doctor?.doc_id}?page=${reset ? 1 : page}&pageSize=14`);
      const newSessions = response.data.data;
     
      if (newSessions.length === 0 && (reset || page === 1)) {
        setIsEmpty(true);
        setHasMore(false);
      } else {
        setSessionsHistory(prevSessions => reset ? newSessions : [...prevSessions, ...newSessions]);
        setHasMore(newSessions.length > 0);
        setIsEmpty(false);
      }

    } catch (error) {
      if (error.response?.status === 404 && (reset || page === 1)) {
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
    fetchSessions();
  }, [page]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return <LoadingComponent />;
  };

  const handleProfile = (id) => {
    setPac_id(id);
    navigation.navigate('PatientProfile');
  };

  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchSessions(true);
  };

  if (isEmpty && sessionsHistory.length === 0) {
    return <NotFoudMessageList />;
  }

  return (
    <View style={styles.container}>
      {false && <Text style={styles.title}>Histórico de Acesso</Text>}

      <View style={styles.listContainer}>
        <FlatList
          data={sessionsHistory}
          keyExtractor={(item) => item?.ses_id.toString()}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.pressable}
              onPress={() => handleProfile(item?.pacient?.pac_id)}
            >
              <List.Item
                title={`${item.pacient.name}`}
                description={`Sessão: ${dayjs(item.created_at).format('DD/MM/YYYY - HH:mm')}`}
                left={(props) => <List.Icon {...props} icon="history" />}
              />
              <Divider />
            </Pressable>
          )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pressable: {
    right: 15
  },
  listContainer: {
    flexGrow: 1,
    width: '100%',
    borderWidth: 0,
  },
});
