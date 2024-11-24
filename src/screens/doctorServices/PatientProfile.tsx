import React, { useContext, useEffect, useState } from 'react';
import { Alert, BackHandler, Dimensions, FlatList, Linking, Platform, ScrollView, Text, View } from 'react-native';
import { Avatar, Button, Card, Modal, Title } from 'react-native-paper';

import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { AntDesign } from '@expo/vector-icons';
import * as  Animatable from "react-native-animatable"
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Context } from '../../context/AuthProvider'
import { ContextGlobal } from '../../context/GlobalContext'
import downloadPDF from '../../utils/downloadPDF'
import { api } from '../../config/Api'
import CustomText from '../../components/customText'
import { colorGreen, colorPrimary, colorRed, colorSecundary } from '../../style/ColorPalette'
import ErrorMessage from '../../components/errorMessage'
import { ContextPacient } from '../../context/PacientContext';
import { FormatPacient } from '../../interfaces/globalInterface';
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';
import { Sheet } from 'tamagui';

const PatientProfile = ({ navigation }) => {

    const { pac_id, setPac_id } = useContext(ContextPacient);
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [pacient, setPacient] = useState<FormatPacient>();
    const [protocols, setProtocols] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [firstModal, setFirstModal] = useState<boolean>(true);
    const [page, setPage] = React.useState(0);
    const { setIsFromRegistration, isFromRegistration } = useContext(ContextGlobal)
    const [visible, setVisible] = useState(false);
    const { accessToken } = useContext(Context);


    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


    const navigateToMyInformation = () => {
        hideModal();
        navigation.navigate('MyInformation');
    };
    useEffect(() => {
        setIsFromRegistration(true)
    }, [isFromRegistration])

    useEffect(() => {
        return () => backHandler.remove();
    }, [modalVisible]);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (modalVisible) {
            setModalVisible(false)
            return true
        }

        return false;
    });


    async function getPdf() {
        try {
          setLoading(true);
          const response: any = await api.get("/food-intake-report");
    
          await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, accessToken, setLoading  )
        } catch (error) {
          console.error("Ocorreu Ezum erro", error)
          alert("Erro ao gerar pdf")
    
        }
      }


    useFocusEffect(
        
        React.useCallback(() => {

            const fetchData = async () => {
                try {
                    const response = await api.get(`/pacient/${pac_id}`);
                    setPacient(response.data);
                } catch (error) {
                    setLoading(false)
                }

                try {
                    const protocol = await api.get(`last-sessions/${pac_id}/${user?.doctor?.doc_id}?pageSize=100&page=1`);
                    
                    setProtocols(protocol.data);
                    setLoading(false)

                } catch (error) {
                    setLoading(false)
                }
            };

            fetchData();
        }, [pac_id, user?.doctor?.doc_id])
    );

    if (!pacient) {
        return <SkelectonView />
    }
    return (
        <View style={{ flex: 1 }}>           

            <Sheet
                modal={Platform.OS === "ios" ? false : true}
                open={modalVisible}
                dismissOnSnapToBottom
                animation="medium"
                native
                onOpenChange={() => {
                    setModalVisible(false);
                }
                }
                snapPoints={[firstModal ? 60 : 30]} >

                <Sheet.Overlay />

                <Sheet.Frame style={{ borderTopEndRadius: 15, borderTopStartRadius: 15 }}>

                    <HeaderSheet />

                    {firstModal ?
                        <View>
                            <Text style={{ textAlign: "center", fontSize: 22 }}> Sessões</Text>
                            <FlatList
                                style={{ top: 10, padding: 15 }}
                                data={protocols?.data}
                                keyExtractor={(item) => item?.ses_id}
                                renderItem={({ item, index }) => (
                                    <ScrollView>
                                        <Animatable.View >

                                            {
                                                item?.protocol?.name &&
                                                <Card collapsable contentStyle={{ marginBottom: 10, backgroundColor: 'transparent'}} onPress={() => {
                                                    setModalVisible(false);
                                                    navigation.navigate('CurrentProtocol', { protocolId: item?.ses_id });
                                                }} style={{ marginBottom: 10, margin: 2, backgroundColor: "white" }}>
                                                    <Card.Title
                                                        title={item?.protocol?.name}
                                                        titleStyle={{ color: "black" }}
                                                        subtitle={`Data de Criação: ${dayjs(item?.protocol?.created_at).format("DD-MM-YYYY - hh-mm")}`}
                                                        subtitleStyle={{ color: "black" }}
                                                        left={(props) => <AntDesign name={`${index === 0 ? "star" : 'CodeSandbox'}`} size={30} color={colorPrimary} />}
                                                    />
                                                </Card>
                                            }

                                        </Animatable.View>
                                    </ScrollView>
                                )}
                                onEndReachedThreshold={0.1}
                                onEndReached={() => {
                                    setPage((prevPage) => prevPage + 1)
                                }}
                            />
                        </View>
                        :
                        <ScrollView style={{ bottom: 10, paddingHorizontal: 15, paddingVertical: 25 }}>
                            <Text style={{ textAlign: "center", fontSize: 22, marginVertical: 2 }} >Relatórios disponiveis</Text>

                            <Button
                                buttonColor={colorPrimary}
                                textColor='white'
                                icon={(props) => <AntDesign name="pdffile1" style={{ top: 0, left: 0 }} color={"white"} size={18} />}
                                mode="contained"
                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate("ServiceProvisionReceiptPdf", { pacient: pacient })
                                }}
                                style={{ marginTop: 10 }}
                            >
                                Recibo de prestação de serviço
                            </Button>

                            <Button buttonColor={colorPrimary} textColor='white' icon={(props) => <AntDesign name="pdffile1" style={{ top: 0, left: 0 }} color={"white"} size={18} />} mode="contained" onPress={() => {
                                setModalVisible(false);
                                navigation.navigate("MonitoringReportPdf", { pacient: pacient })
                            }} style={{ marginTop: 10 }}>
                                Relatório de acompanhamento
                            </Button>

                            <Button buttonColor={colorPrimary} textColor='white' icon={(props) => <AntDesign name="pdffile1" style={{ top: 0, left: 0 }} color={"white"} size={18} />} mode="contained" onPress={() => {
                                navigation.navigate("DischargeReportPdf", { pacient: pacient })
                                setModalVisible(false);
                            }} style={{ marginTop: 10 }}>
                                Relatório de alta
                            </Button>

                        </ScrollView>
                    }
                </Sheet.Frame>
            </Sheet>

            <ScrollView style={{ padding: 15 }}>

                <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                    <FontAwesome name="user" style={{ top: 0, left: 0 }} color={colorPrimary} size={80} />
                    <Title style={{ marginBottom: 10, }}>{pacient?.first_name && pacient?.first_name}</Title>
                </View>

                <View style={{ marginTop: 15, marginBottom: 40 }}>
                    <Button buttonColor='#36B3B9' icon="information" mode="contained" onPress={() => navigation.navigate("PatientInfo")} style={{ marginBottom: 10 }}>
                        Informação Cadastral
                    </Button>

                    <Button buttonColor='#36B3B9' icon="clipboard-text" mode="contained" onPress={() => { navigation.navigate("AnsweredQuestions") }} style={{ marginBottom: 10 }}>
                        Avaliação/Evolução fonoaudiológica
                    </Button>
                    
                    <Button buttonColor='#36B3B9' icon="clipboard" mode="contained" onPress={getPdf} style={{ marginBottom: 10 }}>
                       Orientação ao paciente-familiares
                    </Button>
                    
                    <Button icon={(props) => <AntDesign name="pdffile1" style={{ top: 0, left: 0 }} color={"white"} size={20} />} buttonColor={colorPrimary} mode='contained' onPress={() => {
                        setFirstModal(false)
                        setModalVisible(true)
                    }}>Gerar recibos e relatórios</Button>

                </View>

                <Text style={{ marginBottom: 10, textAlign: "center", fontSize: 18 }}>Sessões do usuário</Text>

                <View >
                    <Card onPress={() => {
                        if (protocols?.meta?.total) {
                            setFirstModal(true)
                            setModalVisible(true)
                        }
                    }} style={{ marginBottom: 10, backgroundColor:"white"}}>
                        <Card.Title style={{}} title={`${protocols?.meta?.total ? protocols?.meta?.total + " Sessões" : "Nenhuma sessão"}`
                        } left={(props) => !protocols?.meta?.total ? <AntDesign name='closecircleo' size={30} color={ "black"} /> :
                            <AntDesign name='sharealt' size={30} color={colorPrimary} />} />
                    </Card>
                </View>


            </ScrollView>


            <View style={{ bottom: 20, paddingHorizontal: 15, marginHorizontal: 5, paddingBottom: Platform.OS === "ios" && 20 }}>
                <Button buttonColor={colorSecundary} icon="content-save" mode="contained" onPress={() => {
                    navigation.navigate("Section")
                }} style={{ marginTop: 10 }}>
                    Iniciar sessão
                </Button>
              
            </View>
        </View>
    );
};

export default PatientProfile;
