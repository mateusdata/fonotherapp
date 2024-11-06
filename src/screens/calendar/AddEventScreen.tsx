import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, ScrollView, Pressable, ToastAndroid, Platform } from 'react-native';
import { colorPrimary } from '../../style/ColorPalette';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { api } from '../../config/Api';
import { Context } from '../../context/AuthProvider';
import { AgendaNotification } from '../../utils/AgendaNotification';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

const AddEventScreen = ({ navigation }) => {
    const [isAllDay, setIsAllDay] = useState(true);
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const { user } = useContext(Context);
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        date: new Date(),
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === "android") {
            setShowDatePicker(false);
        }
        if (event.type === 'set') {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setNewEvent({
                ...newEvent,
                date: currentDate,
            });
        }
    };

    const onTimeChange = (event, selectedTime) => {
        if (Platform.OS === "android") {
            setShowTimePicker(false);
        }
        if (event.type === 'set') {
            const currentTime = selectedTime || date;
            const updatedDateTime = dayjs(newEvent.date)
                .hour(currentTime.getHours())
                .minute(currentTime.getMinutes())
                .toDate();
            setDate(updatedDateTime);
            setNewEvent({
                ...newEvent,
                date: updatedDateTime,
            });
        }
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true)
        setShowTimePicker(false);
    };
    const showTimePickerModal = () => {
        setShowTimePicker(true)
        setShowDatePicker(false);
    };

    async function createEvent() {
        try {
            if (!newEvent || !newEvent.date) {
                alert("Evento inválido. Verifique os dados.");
                return;
            }

            const fullDateTime = dayjs(newEvent.date).format("YYYY-MM-DD HH:mm:ss");
             console.log(fullDateTime);
            
            const response = await api.post("/appointment", {
                title: title,
                starts_at: fullDateTime
            });
            console.log(response.data);

            AgendaNotification(`Novo evento`, `Lembre de ${title}`, 20 , fullDateTime);

            if (Platform.OS === "android") {
                ToastAndroid.show("Evento criado", ToastAndroid.BOTTOM);
            }
            navigation.goBack();

        } catch (error) {
            console.error("Erro ao criar o evento:", error);
            alert("Ocorreu um erro ao criar o evento.");
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar animated style='dark' />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 40 }}>
                <Ionicons
                    name="close"
                    size={24}
                    color={"black"}
                    onPress={() => navigation.goBack()}
                    style={{ marginLeft: 2 }}
                />
                <TouchableOpacity onPress={createEvent} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.header}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Adicionar título"
                        value={title}
                        multiline
                        numberOfLines={2}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Evento de</Text>
                    <Text selectable style={styles.sectionSubtitle}>{user.person.first_name}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificação</Text>
                    <Switch
                        value={isAllDay}
                        trackColor={{ false: '#e0e0e0', true: "gray" }}
                        onValueChange={() => setIsAllDay(!isAllDay)}
                        thumbColor={isAllDay ? colorPrimary : '#e0e0e0'}
                    />
                </View>

                <View style={styles.section}>
                    <Pressable onPress={showDatePickerModal}>
                        <Text style={styles.sectionTitle}>
                            {dayjs(newEvent.date).format('ddd, D [de] MMM [de] YYYY')}
                        </Text>
                    </Pressable>
                    <Pressable onPress={showTimePickerModal}>
                        <Text style={styles.sectionTitle}>
                            {dayjs(newEvent.date).format('HH:mm')}
                        </Text>
                    </Pressable>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display={Platform.OS === "ios" ? "default" : "default"}
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        value={date}
                        mode="time"
                        is24Hour={true}
                        display={Platform.OS === "ios" ? "default" : "default"}
                        onChange={onTimeChange}
                    />
                )}

                <View style={styles.addDetailsButton}>
                    <View style={styles.header}>
                        <TextInput
                            style={styles.detailsInput}
                            placeholder="Detalhes"
                            value={details}
                            onChangeText={setDetails}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    titleInput: {
        flex: 1,
        fontSize: 24,
        color: '#333',
    },
    detailsInput: {
        flex: 1,
        fontSize: 18,
        color: '#333',
    },
    saveButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colorPrimary,
        borderRadius: 80,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    sectionTitle: {
        fontSize: 16,
        color: '#333',
    },
    sectionSubtitle: {
        color: '#666',
    },
    addDetailsButton: {
        marginTop: 16,
        paddingVertical: 12,
    },
});

export default AddEventScreen;
