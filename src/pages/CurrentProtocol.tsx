import React, { useContext, useEffect, useState } from 'react';
import { BackHandler, Pressable, Text, View } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { api } from '../config/Api';
import { ContextPacient } from '../context/PacientContext';
import { AntDesign } from '@expo/vector-icons';
import { colorGreen, colorRed, colorSecundary } from '../style/ColorPalette';
import { Sheet } from 'tamagui';
import HeaderSheet from '../components/HeaderSheet';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '../components/customText';
import { ResizeMode, Video } from 'expo-av';
import SkelectonView from '../components/SkelectonView';
import { urlPosterSouce } from '../utils/urlPosterSource';
import { videoUrl } from '../utils/videoUrl';


const CurrentProtocol = ({ navigation, route }) => {
    const { setPac_id, pac_id } = useContext(ContextPacient);
    const { protocolId } = route.params;
    const [protocol, setProtocol] = useState(null);
    const [page, setPage] = useState(1);
    const [videosFono, setVideosFono] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [changeList, setChangeList] = useState(true);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setIsVideoPlaying(false)
            if (modalVisible) {
                setModalVisible(false)
                return true
            }
            return false;
        });

        return () => backHandler.remove();
    }, [modalVisible]);



    useEffect(() => {
        const fetchProtocol = async () => {
            try {
                const response = await api.get(`/info-session/${protocolId}`);
                setProtocol(response.data.protocol);
                console.log(response.data.protocol)
            } catch (error) {
                console.error(error);
                // Tratar erro
            }
        };
        fetchProtocol();
    }, [protocolId]);

    if (!protocol) {
        return <SkelectonView />
    }


    const handleVideoPress = (uri) => {
        setSelectedVideo(uri);
        setIsVideoPlaying(true)
        setModalVisible(true);
    };

    return (
        <View style={{ flex: 1, padding: 10, gap: 10 }}>
            <Card>
                <Card.Content>
                    <Title>{protocol.name}</Title>
                    <Paragraph>{protocol.description}</Paragraph>
                    <Paragraph style={{ color: "green" }}>Status: {protocol.status === "active" ? "Ativo" : "Inativo"}</Paragraph>
                </Card.Content>
            </Card>
            {protocol?.exercise_plans.map((plan, index) => (
                <Card key={index} onPress={() => handleVideoPress(plan?.exercise)}>
                    <Card.Content>
                        <Title>Exercicio: {plan.exercise.name}</Title>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Paragraph>Repetitions: {plan.repetitions}</Paragraph>
                            <Pressable onPress={() => handleVideoPress(plan?.exercise)} android_ripple={{ color: colorRed, foreground: true, borderless: true }}>
                                <AntDesign name="playcircleo" size={20} color={"red"} />
                            </Pressable>
                        </View>
                        <Paragraph>Objective: {plan.exercise.objective}</Paragraph>
                    </Card.Content>
                </Card>
            ))}
            <Button onPress={() => navigation.goBack()} mode="contained" style={{ marginTop: 20, backgroundColor: '#36B3B9' }}>
                Voltar
            </Button>



            <Sheet
                modal
                open={modalVisible}
                dismissOnSnapToBottom
                animation="medium"
                native
                onOpenChange={() => {
                    setModalVisible(false);
                    setIsVideoPlaying(false)
                }
                }
                snapPoints={[85]}

            >


                <Sheet.Overlay />

                <Sheet.Frame style={{ borderTopEndRadius: 15, borderTopStartRadius: 15 }}>

                    <HeaderSheet />


                    <ScrollView style={{ backgroundColor: 'transparent', maxWidth: "100%", minWidth: "100%" }}>

                        <CustomText style={{ textAlign: "center", fontSize: 18, marginTop: 12, color: colorSecundary, paddingHorizontal: 25 }}>{selectedVideo?.name}</CustomText>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>

                            <Video
                                style={{ width: "78%", height: 350, borderRadius: 15, borderWidth: 2, borderColor: "transparent" }}
                                source={{ uri: videoUrl + selectedVideo?.video_urls[0] }}
                                resizeMode={ResizeMode.STRETCH}
                                onLoadStart={() => setIsVideoLoading(true)}
                                isLooping={true}
                                key={selectedVideo?.exe_id}
                                usePoster={isVideoLoading}
                                posterSource={{ uri: urlPosterSouce }}
                                posterStyle={{ justifyContent: "center", flex: 1, alignItems: "center", height: 100, top: 110, width: "100%" }}
                                shouldPlay={isVideoPlaying}
                                onLoad={() => {
                                    setIsVideoLoading(false)
                                }}

                            />
                        </View>

                        {!isVideoLoading &&

                            <View style={{ width: "100%", paddingTop: 5, paddingHorizontal: 25 }}>
                                {selectedVideo?.description && <CustomText style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Descrição</CustomText>}
                                <CustomText style={{ textAlign: "justify", fontSize: 15 }}>{selectedVideo?.description}</CustomText>

                                {selectedVideo?.objective && <CustomText style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Objetivo</CustomText>}
                                <CustomText style={{ textAlign: "justify", fontSize: 15 }}>{selectedVideo?.objective}</CustomText>

                                {selectedVideo?.academic_sources && <CustomText style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Referências</CustomText>}
                                <CustomText fontFamily='Poppins_200ExtraLight_Italic' style={{ textAlign: "justify", fontSize: 12 }}>{`" ${selectedVideo?.academic_sources} "`}</CustomText>
                            </View>

                        }

                    </ScrollView>

                </Sheet.Frame>
            </Sheet>

        </View>
    );
};

export default CurrentProtocol;
