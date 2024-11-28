import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { Searchbar, List, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as  Animatable from "react-native-animatable"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../../context/AuthProvider';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import { colorRed } from '../../style/ColorPalette';


const AccompanyPatient = ({ navigation }) => {

    const { logOut, user } = useContext(Context);
    const { setPac_id, pac_id } = useContext(ContextPacient);

    const [searchQuery, setSearchQuery] = useState('');
    const [pacients, setPacients] = useState([]);
    const [isPacientsLocal, setisPacientsLocal] = useState(false);



    const onChangeSearch = async (search) => {

        setSearchQuery(search)
        if (search.length > 0) {
            setisPacientsLocal(false)
            try {
                const response = await api.post(`/search-pacient`, { doc_id: user?.doctor?.doc_id, search: search })
                console.log(response.data)
                setPacients(response?.data);
            } catch (error) {

            }
        }
        else {
            loadData()
        }

    };


    useEffect(() => {

        loadData();
    }, []);


    const loadData = async () => {
        try {
            const pacientesString = await AsyncStorage.getItem('pacientes');
            if (pacientesString !== null && false) {
                setPacients(JSON.parse(pacientesString));
                setisPacientsLocal(true)
                const newPacient = JSON.parse(pacientesString)
                newPacient?.length > 50 && cleanLocalStorage();
            }
        } catch (error) {
            console.error('Erro ao carregar pacientes:', error);
            setisPacientsLocal(false)
        }
    };


    const saveLocalStorage = async (data) => {
        try {
            const pacientesString = await AsyncStorage.getItem('pacientes');
            let pacientesAtualizados = [];
            if (pacientesString !== null) {
                pacientesAtualizados = JSON.parse(pacientesString);
            }

            const cpfExistente = pacientesAtualizados.some(paciente => paciente.cpf === data.cpf);
            if (cpfExistente) {
                return;
            }
            pacientesAtualizados.push(data);

            //await AsyncStorage.setItem('pacientes', JSON.stringify(pacientesAtualizados));

            setPacients(pacientesAtualizados);

        } catch (error) {
            console.error('Erro ao salvar paciente:', error);
        }
    };

    const cleanLocalStorage = async () => {
        try {
            await AsyncStorage.removeItem('pacientes');
            setPacients([])
            setPacients([]);
            console.log('LocalStorage dos pacientes limpo com sucesso!');
        } catch (error) {
            console.error('Erro ao limpar LocalStorage dos pacientes:', error);
        }
    };
    async function cleanSeach() {
        setSearchQuery("")
        setPacients([])
        setisPacientsLocal(false)
    }

    return (
        <View style={{ flex: 1 }}>
            <Animatable.View animation="" style={{ paddingHorizontal: 8, paddingVertical: 5 }}>
                <Searchbar
                    placeholder="Pesquisar pacientes"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    mode='bar'
                    inputMode='search'
                    selectionColor={"gray"}
                    cursorColor={"gray"}
                    onClearIconPress={cleanSeach}
                />
                { pacients.length === 0 && <Text style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                    Nenhum paciente encontrado
                </Text>}
                <Animatable.View animation="">

                    <FlatList
                        data={isPacientsLocal ? pacients?.reverse() : pacients}
                        style={{ top: 5, marginTop: 5, paddingLeft: 6 }}
                        keyExtractor={(item) => item?.pacient?.pac_id}
                        renderItem={({ item, index }) => (
                            <Pressable onPress={() => {
                                setPac_id(item?.pacient?.pac_id);
                                saveLocalStorage(item)
                                navigation.navigate("PatientProfile")
                            }} android_ripple={{ color: "#36B3B9" }}>
                                <>
                                    {false && index === 0 && <Text>Útimas pesquisas</Text>}
                                    <List.Item
                                        style={{ borderBottomWidth: 0.3, borderColor: "gray", width: "96%" }}
                                        title={item?.name + (!item?.pacient?.food_profile ? "❓" : "")}
                                        description={`CPF: ${item.cpf}`}
                                        left={() => <MaterialIcons name="person" size={24} color="#36B3B9" style={{ top: 9, left: 6 }} />}
                                    /></>
                            </Pressable>
                        )}
                    />

                </Animatable.View>


            </Animatable.View>

            {pacients?.length && false ?
                <View style={{ position: "absolute", margin: 16, right: 0, bottom: 0, flex: 1 }}>
                    <Button icon="delete"
                        buttonColor={colorRed} mode="contained" onPress={cleanLocalStorage}>
                        Limpar
                    </Button>
                </View>
                : false
            }




        </View>
    );
};

export default AccompanyPatient;
