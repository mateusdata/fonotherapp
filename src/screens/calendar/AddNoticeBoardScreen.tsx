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
import { Button } from 'react-native-paper';
import { vibrateFeedback } from '../../utils/vibrateFeedback';
import { useAuth } from '../../context/AuthProvider';
import { showToast } from '../../utils/showToast';

dayjs.locale('pt-br');

const AddNoticeBoardScreen = ({ navigation }) => {
    const [isAllDay, setIsAllDay] = useState(true);
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

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

    const closeDateTime = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
    }

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
        setLoading(true)

        try {
            if (!newEvent || !newEvent.date) {
                alert("Evento inválido. Verifique os dados.");
                return;
            }

            const fullDateTime = dayjs(newEvent.date).format("YYYY-MM-DD HH:mm:ss");
            console.log(fullDateTime);

            const response = await api.post("/reminder", {
                title: title,
                starts_at: fullDateTime
            });
            console.log(fullDateTime);

            AgendaNotification(`Novo evento`, `Lembre de ${title}`, 20, fullDateTime);
            vibrateFeedback()

            setTimeout(() => {
                showToast({
                    type: "success",
                    text1: "Evento criado",
                    position: "bottom"
                });
            }, 1000);

            navigation.goBack();

        } catch (error) {
            console.error("Erro ao criar o evento:", error);
            alert("Ocorreu um erro ao criar o evento.");
            setLoading(false)

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

                <Button loading={loading} textColor='white' disabled={!(!!title) || loading} onPress={createEvent} style={{ backgroundColor: colorPrimary, paddingHorizontal: 8 }}  >
                    Salvar
                </Button>
            </View>

            <ScrollView>
                <View style={styles.header}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Título do mural"
                        value={title}
                        multiline
                        numberOfLines={2}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mural de aviso</Text>
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
                        <Text style={styles.sectionTitle}>
                            {dayjs(newEvent.date).format('HH:mm')}
                        </Text>
                    </Pressable>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        locale='pt-br'
                        is24Hour={true}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        value={date}
                        mode="time"
                        is24Hour={true}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onTimeChange}
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

export default AddNoticeBoardScreen;
