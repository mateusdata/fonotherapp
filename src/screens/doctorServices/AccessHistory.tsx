import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Button, List, Divider } from 'react-native-paper';
import { colorPrimary } from '../../style/ColorPalette';
import { api } from '../../config/Api';
import { Context } from '../../context/AuthProvider';
import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import LoadingComponent from '../../components/LoadingComponent';
import { ContextPacient } from '../../context/PacientContext';

const AccessHistoryFitice = [
  { id: '1', data: '25/09/2024', hora: '14:32', local: 'São Paulo, Brasil' },
  { id: '2', data: '24/09/2024', hora: '09:15', local: 'Rio de Janeiro, Brasil' },
  { id: '3', data: '23/09/2024', hora: '19:45', local: 'Belo Horizonte, Brasil' },
  { id: '4', data: '22/09/2024', hora: '07:20', local: 'Curitiba, Brasil' },
];

export default function AccessHistory({ navigation }) {
  const { user } = useContext(Context)
  const [sessionsHistory, setSessionsHistory] = useState([]);
  const [page, setPage] = useState<number>(1);
  const { setPac_id, pac_id } = useContext(ContextPacient);


  async function fetchSessions() {
    try {
      const response = await api.get(`last-appointents/${user?.doctor?.doc_id}?page=${page}&pageSize=50`);
      console.log(response.data);
      setSessionsHistory(response.data.data)

    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    fetchSessions()
  }, []);


  const renderFooter = () => {
    return (
      <LoadingComponent />
    )
  }
  function handleProfile(id: number) {
    setPac_id(id)
    navigation.navigate("PatientProfile");
  }
  const handleEndReached = () => {
    setPage(prevPage => prevPage + 1);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Acesso {page}</Text>
      <View style={styles.listContainer}>
        <FlatList
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          data={sessionsHistory}
          keyExtractor={(item, index) => item?.ses_id.toString()}
          ListFooterComponent={renderFooter}

          renderItem={({ item }) => (
            <Pressable onPress={() => handleProfile(item?.pacient?.pac_id)} key={item.id}>
              <List.Item
                title={`${item.pacient.first_name}`}
                description={`Sessão: ${dayjs(item.created_at).format("DD/MM/YYYY - HH:mm")} `}
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
  listContainer: {
    flexGrow: 1,
    width: "100%",
    borderWidth: 2
  },
  button: {
    marginTop: 20,
    padding: 10,
  },
});
