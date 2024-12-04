import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable, RefreshControl, Alert, Text } from 'react-native';
import { List, Divider, Searchbar, IconButton } from 'react-native-paper';
import { api } from '../../config/Api';
import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import LoadingComponent from '../../components/LoadingComponent';
import utc from 'dayjs/plugin/utc';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthProvider'

dayjs.extend(utc);

export default function PatientEvolutionList({ navigation, route }) {
  const { pac_id } = route.params; // Recebe o pac_id passado pela navegação
  const [evolutions, setEvolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1); // Adiciona a variável de controle de página

  // Função para buscar evoluções
  async function fetchEvolutions(reset = false) {
    if (isLoading || (!reset && !hasMore)) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/records/${pac_id}?page=${reset ? 1 : page}&pageSize=10`);
      const newEvolutions = response.data.data;

      if (reset) {
        // Reseta a lista ao atualizar
        setEvolutions(newEvolutions);
        setPage(2); // Próxima página será a 2
      } else {
        setEvolutions(prevEvolutions => [...prevEvolutions, ...newEvolutions]);
        setPage(prevPage => prevPage + 1);
      }

      if (newEvolutions.length === 0) {
        setHasMore(false);
      }

    } catch (error) {
      console.error('Erro ao buscar as evoluções:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    
    useCallback(() => {
      fetchEvolutions(true); // Reseta a lista quando a tela é focada

    }, [])
  );

  const filteredEvolutions = evolutions.filter(evolution =>
    evolution.comment.toLowerCase().includes(search.toLowerCase())
  );

  const renderFooter = () => {
    if (!isLoading || refreshing) return null;
    return <LoadingComponent />;
  };

  const handleEdit = (evolution) => {
   
    
    navigation.navigate('EditEvolutionScreen', { evolution });
  };

  const handleDelete = (rec_id) => {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja excluir esta evolução?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await api.delete(`/record/${rec_id}`);
              setEvolutions((prevEvolutions) =>
                prevEvolutions.filter((evolution) => evolution.rec_id !== rec_id)
              );
              Alert.alert('Sucesso', 'Evolução excluída com sucesso.');
            } catch (error) {
              console.error('Erro ao excluir a evolução:', error);
              Alert.alert('Erro', 'Não foi possível excluir a evolução.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvolutions(true); // Reseta ao atualizar
  };

  return (
    <View style={styles.container}>
      <Searchbar
        onChangeText={setSearch}
        value={search}
        placeholder="Pesquisar evolução"
        mode="bar"
        inputMode="search"
        selectionColor="gray"
        cursorColor="gray"
        style={{ marginBottom: 10 }}
      />

      {!filteredEvolutions?.length && !isLoading &&
        <Text style={{ textAlign: "center" }}>
          Nenhuma evolução encontrada.
        </Text>}

      <View style={styles.listContainer}>
        <FlatList
          data={filteredEvolutions}
          keyExtractor={(item) => item.rec_id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => {
            const date = dayjs.utc(item.date);
            return (
              <Pressable onPress={() => handleEdit(item)} key={item.rec_id}>
                <List.Item
                  title={item.comment}
                  description={`${date.format('ddd, D [de] MMM [de] YYYY')}`}
                  left={(props) => <List.Icon {...props} icon="comment" />}
                  right={() => (
                    <IconButton
                      icon="delete"
                      onPress={() => handleDelete(item.rec_id)}
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
  listContainer: {
    flexGrow: 1,
    width: '100%',
    borderWidth: 0,
  },
});
