import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { api } from '../../config/Api';
import { Context } from '../../context/AuthProvider';
import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import LoadingComponent from '../../components/LoadingComponent';
import { ContextPacient } from '../../context/PacientContext';
import downloadPDF from '../../utils/downloadPDF';

export default function DocumentPacient({ navigation }) {
  const { user, accessToken } = useContext(Context);
  const { setPac_id } = useContext(ContextPacient);
  const [sessionsHistory, setSessionsHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  async function fetchSessions() {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await api.get(`reports?page=${page}&pageSize=20`);
      const newSessions = response.data.data;

      if (newSessions.length === 0) {
        setHasMore(false);
      } else {
        setSessionsHistory(prevSessions => [...prevSessions, ...newSessions]);
      }
    } catch (error) {
      console.error('Erro ao buscar os relatórios:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, [page]);


  async function downloadPdf(rep_id:any) {
    try {
      const response = await api.get(`/reports/${rep_id}`)
      await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, accessToken, setLoading)
    } catch (error) {
      alert("Ocorreu um error")
    }
  }


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
      <Text style={styles.title}>Últimos relatórios</Text>

      <View style={styles.listContainer}>
        <FlatList
          data={sessionsHistory}
          keyExtractor={(item) => item?.rep_id?.toString()} // Use rep_id como key
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => (
            <Pressable
              style={styles.pressable}
              onPress={() => downloadPdf(item?.rep_id)} // Navegar para o perfil do paciente
            >
              <List.Item
                title={item.pacient.first_name} // Nome do paciente
                description={`Sessão: ${dayjs(item.created_at).format('DD/MM/YYYY - HH:mm')}`} // Data da sessão
                left={(props) => <List.Icon {...props} icon="file-document" color='#FF4D4D' />}
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
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pressable: {
    paddingVertical: 2,
  },
  listContainer: {
    flexGrow: 1,
    width: '100%',
  },
});
