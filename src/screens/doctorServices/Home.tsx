import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl, Linking, Share, Pressable, ImageBackground, Platform } from 'react-native';
import { Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { Context, useAuth } from '../../context/AuthProvider';
import { api } from '../../config/Api';
import { ContextGlobal, useGlobal } from '../../context/GlobalContext';
import { ContextPacient } from '../../context/PacientContext';
import SkelectonSmall from '../../components/SkelectonSmall';
import { colorPrimary } from '../../style/ColorPalette';
import { handleShareApp } from '../../utils/handleShareApp';
import { Sheet } from 'tamagui';
import HeaderSheet from '../../components/HeaderSheet';
import BottomSheetWelcome from '../../components/BottomSheetWelcome';
import { requestNotificationPermissions } from '../../utils/requestNotificationPermissions';


const { width, height } = Dimensions.get('window');

const Home = ({ navigation }: { navigation: any }) => {
  const [totalPacient, setTotalPacient] = useState<any>('');
  const { user, } = useAuth();
  const { pac_id } = useContext(ContextPacient);
  const [mensageToast, setMensageToast] = useState<string>("");
  const { setThereSession, thereSession } = useGlobal();;
  const { setIsFromRegistration } = useGlobal();;

  useFocusEffect(
    React.useCallback(() => {
      setIsFromRegistration(false);
      setThereSession(false);
      fetchData();
     setTimeout(() => {
      requestNotificationPermissions();
     }, 2000);
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
        <AntDesign name={icon} style={{ top: width < 400 ? 19 : 22 }} size={width < 400 ? 22 : 24} color={colorPrimary} />
      </View>
      <View style={{ flex: 0.5, borderWidth: 0, top: 4, width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
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

        {false && <Text>{"Largura da tela" + width + "Largura da tela" + height}</Text>}
        <View style={styles.header}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={{ color: colorPrimary }}>{"Olá, " + user?.person?.name}</Title>
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
          {renderButton("calendar", "Agenda", () => navigation.navigate("CalendarScreen"))}
          {renderButton("notification", "Mural de     Avisos", () => navigation.navigate("NoticeBoard"))}
          {renderButton("filetext1", "Documentos", () => navigation.navigate("DocumentPacient"))}
          {renderButton("wallet", "Financeiro", () => navigation.navigate("Finance"))}
          {renderButton("setting", "Configurações", () => navigation.navigate("Configuration"))}

        </View>


      </ScrollView>
      <BottomSheetWelcome size={ width > 400 ? 35 : 50} />
      
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
    gap: 0
  },
  button: {
    margin: 5,
    width: width < 400 ? 100 : 110,
    height: width < 400 ? 95 : 105,
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
