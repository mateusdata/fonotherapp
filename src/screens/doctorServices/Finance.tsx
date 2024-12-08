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
import { Directory, File, Paths } from 'expo-file-system/next';

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
        const url = 'https://api.fonotherapp.com.br/spreadsheet';
        const destination = FileSystem.documentDirectory + 'Controle_financeiro.xlsx';

        try {
            const { uri } = await FileSystem.downloadAsync(url, destination);
            console.log('Arquivo baixado para:', uri);

            // Compartilhar o arquivo baixado
            if (Platform.OS === "android") {
                const directoryUri = FileSystem.cacheDirectory + "Controle_financeiro.xlsx";
                const base64File = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
                await FileSystem.writeAsStringAsync(directoryUri, base64File, { encoding: FileSystem.EncodingType.Base64 });
                await Sharing.shareAsync(directoryUri);
            } else {
                await Sharing.shareAsync(uri);
            }
        } catch (error) {
            console.error("Erro ao baixar o arquivo:", error);
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

            <View style={styles.listContainer}>
                {
                    isEmpty ? 
                    <View style={{bottom:15}}>
                        <NotFoudMessageList />
                    </View> :

                        < FlatList
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
                }
            </View>
            <View style={styles.fixedButtonContainer}>
                <Button
                    icon="file-excel"
                    mode="contained"
                    buttonColor='#1D6F42'
                    onPress={handleDownloadExcel}
                    style={{
                        bottom: 50,
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
        height: "95%",
        maxHeight: "95%",
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
