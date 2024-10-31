import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { api } from '../../config/Api';
import { Context } from '../../context/AuthProvider';
import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import LoadingComponent from '../../components/LoadingComponent';
import { ContextPacient } from '../../context/PacientContext';

export default function AccessHistory({ navigation }) {
  const { user } = useContext(Context);
  const { setPac_id } = useContext(ContextPacient);
  const [sessionsHistory, setSessionsHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true);
  const [isEmpty, setIsEmpty]  =  useState<boolean>(false)

  async function fetchSessions() {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await api.get(`last-appointents/${user?.doctor?.doc_id}?page=${page}&pageSize=14`);
      const newSessions = response.data.data;

      if (newSessions.length === 0) {
        setHasMore(false);
      } else {
        setSessionsHistory(prevSessions => [...prevSessions, ...newSessions]);
      }

    } catch (error) {
      console.log(error);
      
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, [page]);
  const renderFooter = () => {
    if (!isLoading) return null;
    return <LoadingComponent />;
  };

  const handleProfile = (id: number) => {
    setPac_id(id);
    navigation.navigate('PatientProfile');
  };

  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
     {false &&  <Text style={styles.title}>Histórico de Acesso</Text>}

      <View style={styles.listContainer}>
        <FlatList
          data={sessionsHistory}
          keyExtractor={(item, index) => item?.ses_id.toString()}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => (
            <Pressable
              style={styles.pressable}
              onPress={() => handleProfile(item?.pacient?.pac_id)} key={item.id}>
              <List.Item
                title={`${item.pacient.first_name}`}
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
