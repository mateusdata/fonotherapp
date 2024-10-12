import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl, Linking, Share, Pressable, ImageBackground } from 'react-native';
import { Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { Context } from '../../context/AuthProvider';
import { api } from '../../config/Api';
import { ContextGlobal } from '../../context/GlobalContext';
import { ContextPacient } from '../../context/PacientContext';
import SkelectonSmall from '../../components/SkelectonSmall';
import Toast from '../../components/toast';
import { colorPrimary } from '../../style/ColorPalette';
import { handleShareApp } from '../../utils/handleShareApp';

const Home = ({ navigation }: { navigation: any }) => {
  const [totalPacient, setTotalPacient] = useState<any>('');
  const { user } = useContext(Context);
  const { pac_id } = useContext(ContextPacient);
  const [showToast, setShowToast] = useState<boolean>(true);
  const [mensageToast, setMensageToast] = useState<string>("");
  const { setThereSession, thereSession } = useContext(ContextGlobal);
  const { setIsFromRegistration } = useContext(ContextGlobal);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setShowToast(true);
        setMensageToast("Sem conexão com a internet");
        return;
      }
      setShowToast(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsFromRegistration(false);
      setThereSession(false);
      fetchData();
    }, [pac_id, thereSession, user?.doctor?.doc_id])
  );

  const fetchData = async () => {
    try {
      const response = await api.get(`/count-pacients/${user?.doctor?.doc_id}`);
      setTotalPacient(response?.data.num_pacients);
    } catch (error) {
      if (!error.response) {
      }
    }
  };




  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setTotalPacient("");
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const renderButton = (icon: any, label: string, onPress: () => void) => (
    <Pressable onPress={onPress} style={[styles.button, {}]}>
      <View style={{ flex: 0.5, borderWidth: 0, width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
        <AntDesign name={icon} style={{ top: 25 }} size={24} color={colorPrimary} />
      </View>
      <View style={{ flex: 0.5, borderWidth: 0, top: 8, width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
        <Text style={styles.buttonText}>{label}</Text>
      </View>

    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
      >
        <View style={styles.header}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={{ color: colorPrimary }}>{user?.person.first_name}</Title>
              <View style={styles.pacientsInfo}>
                <AntDesign name="addusergroup" size={22} color="#36B3B9" />
                <Paragraph>
                  {totalPacient !== '' ? (totalPacient === 1 ? ` ${totalPacient} Paciente` : `${totalPacient} Pacientes`) : <SkelectonSmall />}
                </Paragraph>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button textColor='#36B3B9' onPress={() => navigation.navigate("AccompanyPatient")}>Ver todos</Button>
            </Card.Actions>
          </Card>
        </View>



        <View style={styles.buttonContainer}>
          {renderButton("addfile", "Paciente", () => navigation.navigate("CreatePacient"))}
          {renderButton("addusergroup", "Acompanhar", () => navigation.navigate("AccompanyPatient"))}
          {renderButton("check", "Concluir Cadastro", () => navigation.navigate("PacientUnansweredQuestions"))}
          {renderButton("clockcircleo", "Historico           de acesso", () => navigation.navigate("AccessHistory"))}
          {renderButton("calendar", "Agenda", () => navigation.navigate("AgendaDoctor"))}
          {renderButton("notification", "Mural de     Avisos", () => navigation.navigate("NoticeBoard"))}
          {renderButton("filetext1", "Documentos", () => navigation.navigate("FrequentlyAskedQuestions"))}
          {renderButton("wallet", "Financeiro", handleShareApp)}
          {renderButton("setting", "Configurações", () => navigation.navigate("Configuration"))}
          <ImageBackground
            resizeMode='cover'
            blurRadius={5}
            style={{ height: 220, width: 220, left:90}}
            source={require("../../../src/assets/images/marca.png")}
          >
          </ImageBackground>
        </View>



      </ScrollView>

      <Toast visible={showToast} mensage={mensageToast} setVisible={setShowToast} duration={6000} />

    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 5,
  },
  pacientsInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  card: {
    marginVertical: 5,
    backgroundColor: "#ECF2FF",
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 40,
    gap: 10
  },
  button: {
    margin: 5,
    width: 110,
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  buttonText: {
    textAlign: "center",
    marginTop: 10,
    bottom: 10
  },
});
