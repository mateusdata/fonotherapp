import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text, List, Divider, Button } from 'react-native-paper'; // Importando Button do react-native-paper
import { api } from '../../config/Api';
import { Context, useAuth } from '../../context/AuthProvider';
import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import LoadingComponent from '../../components/LoadingComponent';
import { ContextPacient } from '../../context/PacientContext';
import downloadPDF from '../../utils/downloadPDF';
import NotFoudMessageList from '../../components/NotFoudMessageList';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';

export default function Finance({ navigation }) {
    const { user, accessToken } = useAuth();
    const { setPac_id } = useContext(ContextPacient);
    const [sessionsHistory, setSessionsHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    async function fetchSessions() {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const response = await api.get(`reports?page=${page}&pageSize=20&type=termo_de_servico`);
            const newSessions = response.data.data;

            if (newSessions.length === 0) {
                setHasMore(false);
            } else {
                setSessionsHistory(prevSessions => [...prevSessions, ...newSessions]);
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
        }
    }

    useEffect(() => {
        fetchSessions();
    }, [page]);

    async function downloadPdf(rep_id: any) {
        try {
            const response = await api.get(`/reports/${rep_id}`);
            await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, accessToken, setLoading);
        } catch (error) {
            alert("Ocorreu um error");
        }
    }

    const handleDownloadExcel = async () => {
        try {
            const ws = XLSX.utils.json_to_sheet(sessionsHistory);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Relatórios");

            const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

            const path = `${FileSystem.documentDirectory}relatorios_financeiros.xlsx`;

            await FileSystem.writeAsStringAsync(path, wbout, { encoding: FileSystem.EncodingType.Base64 });
           

            // Compartilhar o arquivo
            if (Platform.OS === "android") {
                const directoryUri = FileSystem.cacheDirectory + "relatorios_financeiros.xlsx";
                const base64File = await FileSystem.readAsStringAsync(path, { encoding: FileSystem.EncodingType.Base64 });
                await FileSystem.writeAsStringAsync(directoryUri, base64File, { encoding: FileSystem.EncodingType.Base64 });
                await Sharing.shareAsync(directoryUri);
            } else {
                await Sharing.shareAsync(path);
            }
        } catch (error) {
            console.error("Erro ao gerar Excel:", error);
        }
    };

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

    if (isEmpty) {
        return <NotFoudMessageList />;
    }

    return (
        <View style={styles.container}>
            {false && <Text style={styles.title}>Relatórios financeiros</Text>}

            <View style={styles.listContainer}>
                <FlatList
                    data={sessionsHistory}
                    keyExtractor={(item, index) => `${item?.rep_id}-${index}`} // Garante a unicidade da chave
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.pressable}
                            onPress={() => downloadPdf(item?.rep_id)} // Navegar para o perfil do paciente
                        >
                            <List.Item
                                title={item.pacient.name} // Nome do paciente
                                description={`Sessão: ${dayjs(item.created_at).format('DD/MM/YYYY - HH:mm')}`} // Data da sessão
                                left={(props) => <List.Icon {...props} icon="file-document" color='#FF4D4D' />}
                            />
                            <Divider />
                        </Pressable>
                    )}
                />
            </View>
            <View style={styles.fixedButtonContainer}>
                <Button
                    icon="file-excel"
                    mode="contained"
                    buttonColor='#1D6F42'
                    onPress={handleDownloadExcel}
                    style={{
                        bottom: 20,
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                    }}
                >
                  Controle financeiro
                </Button>
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
    downloadButton: {
        marginTop: 15,
        width: '90%',
    },
    fixedButtonContainer: {
        padding: 10,
        width: '100%',
    },
});
