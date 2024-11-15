import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { List } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";
import { Context } from '../../context/AuthProvider';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import CustomText from '../../components/customText';
import SkelectonView from '../../components/SkelectonView';
import NotFoudMessageList from '../../components/NotFoudMessageList';

const PacientUnansweredQuestions = ({ navigation }) => {
    const { user } = useContext(Context);
    const { setPac_id } = useContext(ContextPacient);
    const [loading, setLoading] = useState(true);
    const [pacients, setPacients] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchPacients();
    }, []);

    const fetchPacients = async (newPage = 1) => {
        if (newPage === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response = await api.get(`/pending-pacients/${user?.doctor?.doc_id}?page=${newPage}&pageSize=25`);
            const fetchedPacients = response?.data?.pacients || [];
            if (newPage === 1) {
                setPacients(fetchedPacients);
            } else {
                setPacients(prevPacients => [...prevPacients, ...fetchedPacients]);
            }

            setHasMore(fetchedPacients.length > 0);
            setPage(newPage);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    const loadMorePacients = () => {
        if (!loadingMore && hasMore) {
            fetchPacients(page + 1);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPacients(1);
    };

    if (loading && !refreshing) {
        return <SkelectonView delay={0} />;
    }

    return (
        <View style={{ paddingHorizontal: 8, paddingVertical: 5 }}>
            {pacients.length > 0 ? (
                <CustomText style={{ fontSize: 18, padding: 10, textAlign: "center" }}>
                    Pacientes com cadastro incompletos
                </CustomText>
            ) : (
                <NotFoudMessageList />
            )}

            <View>
                <Animatable.View animation="">
                    <FlatList
                        data={pacients}
                        style={{ top: 5, marginTop: 5, paddingLeft: 6 }}
                        keyExtractor={(item) => item?.pac_id}
                        renderItem={({ item }) => (
                            <Pressable

                                onPress={() => {
                                    setPac_id(item?.pac_id);
                                    navigation.navigate(!!item?.base_diseases ? "PatientAnalysis" : "Anamnese");
                                }}
                                android_ripple={{ color: "#36B3B9" }}
                            >
                                <List.Item
                                    style={{ borderBottomWidth: 0.3, borderColor: "gray", width: "96%" }}
                                    title={item.first_name}
                                    description={`CPF: ${item?.person?.cpf}`}
                                    left={() => (
                                        <MaterialIcons
                                            name="person"
                                            size={24}
                                            color="#36B3B9"
                                            style={{ top: 9, left: 6 }}
                                        />
                                    )}
                                />
                            </Pressable>
                        )}
                        contentContainerStyle={{
                            paddingBottom: 50
                        }}
                        onEndReached={loadMorePacients}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#36B3B9" /> : null}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                        }
                    />
                </Animatable.View>
            </View>
        </View>
    );
};

export default PacientUnansweredQuestions;
