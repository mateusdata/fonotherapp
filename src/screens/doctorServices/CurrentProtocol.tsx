import React, { useContext, useEffect, useState } from 'react';
import { BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { Sheet } from 'tamagui';
import { ScrollView } from 'react-native-gesture-handler';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import { colorRed, colorSecundary } from '../../style/ColorPalette';
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';
import CustomText from '../../components/customText';
import { videoUrl } from '../../utils/videoUrl';
import { useVideoPlayer, VideoView } from 'expo-video';

const CurrentProtocol = ({ navigation, route }) => {
    const { protocolId } = route.params;
    const [protocol, setProtocol] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const player = useVideoPlayer(videoUrl + selectedVideo?.video_urls[0], player => {
        player.loop = true;
        player.play();
    });

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (modalVisible) {
                player.pause();
                setModalVisible(false)
                setSelectedVideo(null)
                return true
            }
            return false;
        });

        return () => backHandler.remove();
    }, [modalVisible]);


    const onOpenChange = () => {
        setModalVisible(false);
        player.pause();
        setSelectedVideo(null)
    }



    useEffect(() => {
        const fetchProtocol = async () => {
            try {
                const response = await api.get(`/session/${protocolId}`);
                setProtocol(response.data.protocol);
               
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
        setModalVisible(true);
    };

    return (
        <>
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
                            <Paragraph>Objective: {plan?.exercise?.objective}</Paragraph>
                        </Card.Content>
                    </Card>
                ))}
                <Button onPress={() => navigation.goBack()} mode="contained" style={{ marginTop: 20, backgroundColor: '#36B3B9' }}>
                    Voltar
                </Button>


            </View>

            <Sheet
                modal={Platform.OS === "ios" ? false : true}
                open={modalVisible}
                dismissOnSnapToBottom
                animation="medium"
                native
                onOpenChange={onOpenChange}
                snapPoints={[85]}

            >

                <Sheet.Overlay />

                <Sheet.Frame style={{ borderTopEndRadius: 15, borderTopStartRadius: 15 }}>

                    <HeaderSheet />


                    <ScrollView style={{ backgroundColor: 'transparent', maxWidth: "100%", minWidth: "100%" }}>

                        <CustomText style={{ textAlign: "center", fontSize: 18, marginTop: 12, color: colorSecundary, paddingHorizontal: 25 }}>{selectedVideo?.name}</CustomText>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>

                            <VideoView
                                style={styles.video}
                                player={player}
                                contentFit={"cover"}
                                allowsFullscreen={false}
                                allowsPictureInPicture={false}
                                nativeControls={false}

                            />
                        </View>



                        <View style={{ width: "100%", paddingTop: 5, paddingHorizontal: 25 }}>
                            {selectedVideo?.description && <CustomText style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Descrição</CustomText>}
                            <CustomText style={{ textAlign: "justify", fontSize: 15 }}>{selectedVideo?.description}</CustomText>

                            {selectedVideo?.objective && <CustomText style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Objetivo</CustomText>}
                            <CustomText style={{ textAlign: "justify", fontSize: 15 }}>{JSON.stringify(selectedVideo?.objective)}</CustomText>

                            {selectedVideo?.academic_sources && <CustomText style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Referências</CustomText>}
                            <CustomText fontFamily='Poppins_200ExtraLight_Italic' style={{ textAlign: "justify", fontSize: 12 }}>{`" ${selectedVideo?.academic_sources} "`}</CustomText>
                        </View>

                    </ScrollView>

                </Sheet.Frame>
            </Sheet>
        </>
    );
};

export default CurrentProtocol;

const styles = StyleSheet.create({

    video: {
        alignSelf: 'center',
        width: 275,
        height: 350,
        borderRadius: 20,
        padding: 20,
        marginVertical: 10,
        margin: 15,
        backgroundColor: '#f5f5f5',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

});