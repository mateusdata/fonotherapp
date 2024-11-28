import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, ScrollView, Pressable, ToastAndroid, Platform } from 'react-native';
import { colorPrimary } from '../../style/ColorPalette';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { api } from '../../config/Api';
import { Context } from '../../context/AuthProvider';
import { AgendaNotification } from '../../utils/AgendaNotification';
import { Button } from 'react-native-paper';
import { vibrateFeedback } from '../../utils/vibrateFeedback';

dayjs.locale('pt-br');

const EditEventScreen = ({ navigation, route }) => {
    const { app_id, title: initialTitle, starts_at: initialTime, details: initialDetails } = route.params.event;
    const [isAllDay, setIsAllDay] = useState(true);
    const [title, setTitle] = useState(initialTitle);
    const [details, setDetails] = useState(initialDetails);
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(false);

    useEffect(() => {


    }, [])
    const [newEvent, setNewEvent] = useState({
        title: initialTitle,
        description: initialDetails,
        date: dayjs(route.params.event.starts_at),
        time: dayjs(initialTime).format('HH:mm'),
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [date, setDate] = useState(dayjs(route.params.event.starts_at));

    const handleTimeChange = (event, selectedTime) => {

        if (Platform.OS === "android") {
            setShowTimePicker(false);
        }
        const currentTime = selectedTime || new Date();
        setNewEvent({
            ...newEvent,
            time: dayjs(currentTime).format('HH:mm'),
        });
    };

    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === "android") {
            setShowTimePicker(false);
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

    const showDatePickerModal = () => {
        setShowDatePicker(true)
        setShowTimePicker(false);
    };
    const showTimePickerModal = () => {
        setShowTimePicker(true)
        setShowDatePicker(false);
    };



    async function updateEvent() {
        setLoading(true)

        try {
            if (!newEvent || !newEvent.date || !newEvent.time) {
                alert("Evento inválido. Verifique os dados.");
                return;
            }

            const date = dayjs(newEvent.date);
            const timeParts: any = newEvent.time.split(':');
            const time = dayjs().hour(timeParts[0]).minute(timeParts[1]);

            if (!date.isValid()) {
                alert("Data inválida.");
                return;
            }
            if (!time.isValid()) {
                alert("Hora inválida.");
                return;
            }

            const fullDateTime = date.hour(time.hour()).minute(time.minute()).format("YYYY-MM-DD HH:mm:ss");
            const response = await api.put(`/appointment/${app_id}`, {
                title: title,
                starts_at: fullDateTime
            });
            vibrateFeedback()

            if (Platform.OS === "android") {
                ToastAndroid.show("Evento atualizado", ToastAndroid.BOTTOM);
            }
            AgendaNotification(`Novo evento`, `Lembre de ${title}`, 20, fullDateTime);

            navigation.goBack();

        } catch (error) {
            console.error("Erro ao atualizar o evento:", error);
            alert("Ocorreu um erro ao atualizar o evento.");
            setLoading(false)

        }
    }

    const closeDateTime = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
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


                <Button loading={loading} textColor='white' disabled={!(!!title) || loading} onPress={updateEvent} style={{ backgroundColor: colorPrimary, paddingHorizontal: 8 }}  >
                    Salvar
                </Button>
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
                    <Text selectable style={styles.sectionSubtitle}>{user?.person?.name}</Text>
                </View>

                {false && <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificação</Text>
                    <Switch
                        value={isAllDay}
                        trackColor={{ false: '#e0e0e0', true: "gray" }}
                        onValueChange={() => setIsAllDay(!isAllDay)}
                        thumbColor={isAllDay ? colorPrimary : '#e0e0e0'}
                    />
                </View>}

                <View style={styles.section}>
                    <Pressable onPress={showDatePickerModal}>
                        <Text style={styles.sectionTitle}>
                            {dayjs(newEvent.date).format('ddd, D [de] MMM [de] YYYY')}
                        </Text>
                    </Pressable>

                    <Pressable onPress={showTimePickerModal}>
                        <Text style={styles.sectionTitle}>{newEvent.time}</Text>
                    </Pressable>
                </View>

                {showTimePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="time"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handleTimeChange}
                    />
                )}

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date(date.toISOString())}
                        mode="date"
                        locale='pt-br'
                        is24Hour={true}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}

                <View style={styles.addDetailsButton} onTouchStart={closeDateTime}>
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
        paddingVertical: 0,
        paddingHorizontal: 10,
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

export default EditEventScreen;
