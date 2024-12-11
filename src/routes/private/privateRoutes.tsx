import React, { useContext, useEffect } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Button, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Context, useAuth } from '../../context/AuthProvider';
import TabsNavigation from './tabNavigation/tabNavigation';
import { StatusBar } from 'expo-status-bar';
import { colorPrimary } from '../../constants/ColorPalette';
import CreatePacient from '../../screens/doctorServices/CreatePacient';
import Anamnese from '../../screens/doctorServices/Anamnese';
import MyInformation from '../../screens/account/MyInformation';
import ChangeName from '../../screens/account/ChangeName';
import ChangeEmail from '../../screens/account/ChangeEmail';
import ChangeCredential from '../../screens/account/ChangeCredential';
import Help from '../../screens/support/Help';
import Feedback from '../../screens/support/Feedback';
import PacientUnansweredQuestions from '../../screens/doctorServices/PacientUnansweredQuestions';
import PatientProfile from '../../screens/doctorServices/PatientProfile';
import PatientInfo from '../../screens/doctorServices/PacientInfo';
import AccompanyPatient from '../../screens/doctorServices/AccompanyPatient';
import Section from '../../screens/doctorServices/Section';
import CurrentProtocol from '../../screens/doctorServices/CurrentProtocol';
import ServiceProvisionReceiptPdf from '../../screens/doctorServices/ServiceProvisionReceiptPdf';
import MonitoringReportPdf from '../../screens/doctorServices/MonitoringReportPdf';
import DischargeReportPdf from '../../screens/doctorServices/DischargeReportPdf';
import FrequentlyAskedQuestions from '../../screens/support/FrequentlyAskedQuestions';
import ChangeGovLicense from '../../screens/account/ChangeGovLicense';
import ChangePhone from '../../screens/account/ChangePhone';
import { Ionicons } from '@expo/vector-icons'
import AccessHistory from '../../screens/doctorServices/AccessHistory';
import AgendaDoctor from '../../screens/doctorServices/AgendaDoctor';
import NoticeBoard from '../../screens/calendar/NoticeBoardScreen';
import Configuration from '../../screens/account/Configuration';
import SecuritySettings from '../../screens/account/SecuritySettings';
import DocumentPacient from '../../screens/doctorServices/DocumentPacient';
import Finance from '../../screens/doctorServices/Finance';
import CalendarScreen from '../../screens/calendar/CalendarScreen';
import AddEventScreen from '../../screens/calendar/AddEventScreen';
import EditEventScreen from '../../screens/calendar/EditEventScreen';
import MyAgenda from '../../screens/calendar/MyAgenda';
import AddNoticeBoardScreen from '../../screens/calendar/AddNoticeBoardScreen';
import Consultancy from '../../screens/support/Consultancy';
import EditNoticeBoardScreen from '../../screens/calendar/EditNoticeBoardScreen';
import PacientEvolution from '../../screens/doctorServices/PacientEvolution';
import ListPacientEvolution from '../../screens/doctorServices/ListPacientEvolution';
import EditEvolutionScreen from '../../screens/doctorServices/EditEvolutionScreen';
import PatientOverview from '../../screens/doctorServices/PatientOverview';
import { getUser } from '../../utils/getUser';
import PatientEvaluation from '../../screens/doctorServices/PatientEvaluation';
import UpdatePatientEvaluation from '../../screens/doctorServices/UpdatePatientEvaluation';
import UserPhoto from '../../screens/account/UserPhoto';
import DeleteAccount from '../../screens/account/DeleteAccount';

const AppStack = createStackNavigator();
const PrivateRoutes = () => {
  const navigation = useNavigation();
  const { setUser } = useAuth()
  const fetchUser = async () => {
    await getUser(setUser)
  }
  useEffect(() => {
    fetchUser();
  }, [])

  return (
    <>
      <StatusBar animated hideTransitionAnimation='fade' style='light' />

      <AppStack.Navigator id={undefined} screenOptions={{
        animation: Platform.OS === "ios" ? "fade_from_bottom" : "slide_from_right",
        headerTintColor: "white", headerStyle: {
          backgroundColor: colorPrimary
        },
        headerBackTitle: "",


      }}>

        <AppStack.Screen name='Root' component={TabsNavigation} options={{

          headerShown: false,
        }} />

        <AppStack.Screen name='CreatePacient' component={CreatePacient} options={{ headerTitle: "Cadastrar paciente", headerTitleAlign: "center" }} />
        <AppStack.Screen name='Anamnese' component={Anamnese} options={{ headerTitleAlign: "center" }} />

        <AppStack.Screen name='MyInformation' component={MyInformation} options={{ headerTitleAlign: "center", headerTitle: "Minhas informações" }} />
        <AppStack.Screen name='ChangeName' component={ChangeName} options={{ headerTitleAlign: "center", headerTitle: "Alterar nome", presentation: "modal", animation: Platform.OS === "ios" ? null : "slide_from_right" }} />
        <AppStack.Screen name='ChangeEmail' component={ChangeEmail} options={{ headerTitleAlign: "center", headerTitle: "Alterar email", presentation: "modal", animation: Platform.OS === "ios" ? null : "slide_from_right" }} />
        <AppStack.Screen name='ChangeCredential' component={ChangeCredential} options={{ headerTitleAlign: "center", headerTitle: "Alterar senha", presentation: "modal", animation: Platform.OS === "ios" ? null : "slide_from_right" }} />
        <AppStack.Screen name='Help' component={Help} options={{ headerTitleAlign: "center", headerTitle: "Contato" }} />
        <AppStack.Screen name='Consultancy' component={Consultancy} options={{ headerTitleAlign: "center", headerTitle: "Consultoria" }} />


        <AppStack.Screen name='Feedback' component={Feedback} options={{ headerTitleAlign: "center", headerTitle: "Feedback" }} />
        <AppStack.Screen name='PatientEvaluation' component={PatientEvaluation} options={{ headerTitleAlign: "center", headerTitle: "", headerShown: true }} />
        <AppStack.Screen name='PacientUnansweredQuestions' component={PacientUnansweredQuestions} options={{ headerTitleAlign: "center", headerTitle: "Concluir cadastro" }} />

        <AppStack.Screen name='PatientProfile' component={PatientProfile} options={{ headerTitleAlign: "center", headerTitle: "Perfil do paciente" }} />
        <AppStack.Screen name='PatientInfo' component={PatientInfo} options={{ headerTitleAlign: "center", headerTitle: "Informação do paciente" }} />
        <AppStack.Screen name='AccompanyPatient' component={AccompanyPatient} options={{ headerTitleAlign: "center", headerTitle: "Acompanhar paciente" }} />
        <AppStack.Screen name='PatientOverview' component={PatientOverview} options={{ headerTitleAlign: "center", headerTitle: "Quadro Geral" }} />
        <AppStack.Screen name='Section' component={Section} options={{ headerTitleAlign: "center", headerTitleStyle: { color: "white" }, headerTitle: "Sessão" }} />
        <AppStack.Screen name='CurrentProtocol' component={CurrentProtocol} options={{ headerTitleAlign: "center", headerTitleStyle: { color: "white" }, headerTitle: "Lista de exercicios" }} />
        <AppStack.Screen name='PacientEvolution' component={PacientEvolution} options={{ headerTitleAlign: "center", headerTitleStyle: { color: "white" }, headerTitle: "Evolução do paciente" }} />
        <AppStack.Screen name='ListPacientEvolution' component={ListPacientEvolution} options={{ headerTitleAlign: "center", headerTitleStyle: { color: "white" }, headerTitle: "Evolução do paciente" }} />
        <AppStack.Screen name='EditEvolutionScreen' component={EditEvolutionScreen} options={{
          headerTitleAlign: "center",
          headerTitleStyle: { color: "white" },
          headerTitle: "Editar evolução",

        }} />




        <AppStack.Screen name='ServiceProvisionReceiptPdf' component={ServiceProvisionReceiptPdf} options={{ headerTitleAlign: "center", headerTitle: "Recibo de prestação de serviço" }} />
        <AppStack.Screen name='MonitoringReportPdf' component={MonitoringReportPdf} options={{ headerTitleAlign: "center", headerTitle: "Relatório de Acompanhamento" }} />
        <AppStack.Screen name='DischargeReportPdf' component={DischargeReportPdf} options={{ headerTitleAlign: "center", headerTitle: " Relatório de Alta " }} />

        <AppStack.Screen name='FrequentlyAskedQuestions' component={FrequentlyAskedQuestions} options={{ headerTitleAlign: "center", headerTitle: "Guias de Suporte" }} />
        <AppStack.Screen name='ChangeGovLicense' component={ChangeGovLicense} options={{ headerTitleAlign: "center", headerTitle: "Meu CRFA", presentation: "modal", animation: Platform.OS === "ios" ? null : "slide_from_right" }} />
        <AppStack.Screen name='ChangePhone' component={ChangePhone} options={{ headerTitleAlign: "center", headerTitle: "Meu Telefone", presentation: "modal", animation: Platform.OS === "ios" ? null : "slide_from_right" }} />


        <AppStack.Screen name='Configuration' component={Configuration} options={{ headerTitleAlign: "center", headerTitle: "Configurações" }} />
        <AppStack.Screen name='AccessHistory' component={AccessHistory} options={{ headerTitleAlign: "center", headerTitle: "Historico de acesso" }} />
        <AppStack.Screen name='NoticeBoard' component={NoticeBoard} options={{ headerTitleAlign: "center", headerTitle: "Mural de avisos" }} />
        <AppStack.Screen name='SecuritySettings' component={SecuritySettings} options={{ headerTitleAlign: "center", headerTitle: "Segurança" }} />
        <AppStack.Screen name='DocumentPacient' component={DocumentPacient} options={{ headerTitleAlign: "center", headerTitle: "Últimos relatório" }} />
        <AppStack.Screen name='Finance' component={Finance} options={{ headerTitleAlign: "center", headerTitle: "Relatórios financeiros" }} />

        {/* Rotas de agendas */}
        <AppStack.Screen name='AgendaDoctor' component={AgendaDoctor} options={{ headerTitleAlign: "center", headerTitle: "Agenda" }} />
        <AppStack.Screen name='CalendarScreen' component={CalendarScreen} options={{ headerTitleAlign: "center", headerTitle: "Agenda" }} />
        <AppStack.Screen name='AddEventScreen' component={AddEventScreen} options={{

          headerTitleAlign: "center",
          headerTitle: "",
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: "white"
          },
          headerShown: false,
          animation: Platform.OS === "ios" ? null : "slide_from_right",
          presentation: "modal"
        }} />
        <AppStack.Screen name='EditEventScreen' component={EditEventScreen} options={{

          headerTitleAlign: "center",
          headerTitle: "",
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: "white"
          },
          headerShown: false,
          animation: null,
          presentation: "modal"

        }} />

        <AppStack.Screen name='MyAgenda' component={MyAgenda} options={{ headerTitleAlign: "center", headerTitle: "Agenda" }} />
        <AppStack.Screen name='AddNoticeBoardScreen' component={AddNoticeBoardScreen} options={{

          headerTitleAlign: "center",
          headerTitle: "",
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: "white"
          },
          headerShown: false,
          animation: null,
          presentation: "modal"

        }} />

        <AppStack.Screen name='EditNoticeBoardScreen' component={EditNoticeBoardScreen} options={{

          headerTitleAlign: "center",
          headerTitle: "",
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: "white"
          },
          headerShown: false,
          animation: null,
          presentation: "modal"

        }} />

        {/*Rotas de atualização das analises funcional e estrutural */}

        <AppStack.Screen name='UpdatePatientEvaluation' component={UpdatePatientEvaluation} options={{ headerTitleAlign: "center", headerTitle: "Atualização" }} />

        {/*Rotas de visualização de fotoss */}

        <AppStack.Screen name='UserPhoto' component={UserPhoto} options={{ headerTitleAlign: "center", headerTitle: "Foto de perfil" }} />


        {/*Rotas de Excluir conta */}
        <AppStack.Screen name='DeleteAccount' component={DeleteAccount}
          options={{
            headerTitle: "Apagar Conta",
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: colorPrimary
            },
            headerShown: true,
          
            animation: null,
            presentation: Platform.OS === "ios" ? "transparentModal" : "modal",

          }}
        />


      </AppStack.Navigator>
    </>
  )
}

export default PrivateRoutes;

