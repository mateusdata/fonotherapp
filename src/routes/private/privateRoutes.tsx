import React, { useContext } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Button, Pressable, View } from 'react-native';
import CustomText from '../../components/customText';
import { useNavigation } from '@react-navigation/native';
import { Context } from '../../context/AuthProvider';
import TabsNavigation from './tabNavigation/tabNavigation';
import { StatusBar } from 'expo-status-bar';
import { colorPrimary } from '../../style/ColorPalette';
import CreatePacient from '../../pages/doctorServices/CreatePacient';
import Anamnese from '../../pages/doctorServices/Anamnese';
import MyInformation from '../../pages/account/MyInformation';
import ChangeName from '../../pages/account/ChangeName';
import ChangeEmail from '../../pages/account/ChangeEmail';
import ChangeCredential from '../../pages/account/ChangeCredential';
import Help from '../../pages/support/Help';
import Feedback from '../../pages/support/Feedback';
import PatientAnalysis from '../../pages/doctorServices/PatientAnalysis';
import PacientUnansweredQuestions from '../../pages/doctorServices/PacientUnansweredQuestions';
import Protokol from '../../pages/doctorServices/Protokol';
import PatientInfo from '../../pages/doctorServices/PacientInfo';
import AccompanyPatient from '../../pages/doctorServices/AccompanyPatient';
import AnsweredQuestions from '../../pages/doctorServices/AnsweredQuestions';
import Section from '../../pages/doctorServices/Section';
import CurrentProtocol from '../../pages/doctorServices/CurrentProtocol';
import NoInternet from '../../pages/support/NoInternet';
import ServiceProvisionReceiptPdf from '../../pages/doctorServices/ServiceProvisionReceiptPdf';
import MonitoringReportPdf from '../../pages/doctorServices/MonitoringReportPdf';
import DischargeReportPdf from '../../pages/doctorServices/DischargeReportPdf';
import FrequentlyAskedQuestions from '../../pages/support/FrequentlyAskedQuestions';
import ChangeGovLicense from '../../pages/account/ChangeGovLicense';
import ChangePhone from '../../pages/account/ChangePhone';
import UpdatePacient from '../../pages/doctorServices/UpdatePacient';

const AppStack = createStackNavigator();
const PrivateRoutes = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(Context)

  return (
    <>
      <StatusBar animated hideTransitionAnimation='fade' style='light' />
      
      <AppStack.Navigator screenOptions={{headerBackTitleVisible:false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTintColor: "white", headerStyle: { backgroundColor: colorPrimary
        }}}>
          
        <AppStack.Screen name='Root' component={TabsNavigation} options={{headerBackTitleVisible:false,
          headerShown: false,
        }} />

        <AppStack.Screen name='CreatePacient' component={CreatePacient} options={{headerBackTitleVisible:false,headerTitle:"Cadastrar paciente", headerTitleAlign:"center"}}/>
        <AppStack.Screen name='Anamnese' component={Anamnese} options={{headerBackTitleVisible:false,headerTitleAlign:"center"}}/>
        <AppStack.Screen name='MyInformation' component={MyInformation} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Minhas informações" }} />
        <AppStack.Screen name='ChangeName' component={ChangeName} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Alterar nome" }} />
        <AppStack.Screen name='ChangeEmail' component={ChangeEmail} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Alterar email" }} />
        <AppStack.Screen name='ChangeCredential' component={ChangeCredential} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Alterar senha" }} />
        <AppStack.Screen name='Help' component={Help} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Contato" }} />
        <AppStack.Screen name='Feedback' component={Feedback} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Feedback" }} />
        <AppStack.Screen name='PatientAnalysis' component={PatientAnalysis} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "", headerShown:true }} />
        <AppStack.Screen name='PacientUnansweredQuestions' component={PacientUnansweredQuestions} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Concluir cadastro" }}/>

        <AppStack.Screen name='Protokol' component={Protokol} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Perfil do paciente" }} />
        <AppStack.Screen name='PatientInfo' component={PatientInfo} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Informação do paciente" }} />
        <AppStack.Screen name='AccompanyPatient' component={AccompanyPatient} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Acompanhar paciente" }} />
        <AppStack.Screen name='AnsweredQuestions' component={AnsweredQuestions} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Quadro Geral" }} />        
        <AppStack.Screen name='Section' component={Section} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitleStyle: { color: "white" }, headerTitle: "Sessão" }} />
        <AppStack.Screen name='CurrentProtocol' component={CurrentProtocol} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitleStyle: { color: "white" }, headerTitle: "Lista de exercicios" }} />
        <AppStack.Screen name='NoInternet' component={NoInternet} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitleStyle: { color: "white" }, headerTitle: "Lista de exercicios" }} />
        
        <AppStack.Screen name='ServiceProvisionReceiptPdf' component={ServiceProvisionReceiptPdf} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Recibo de prestação de serviço" }} />
        <AppStack.Screen name='MonitoringReportPdf' component={MonitoringReportPdf} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Relatório de acompanhamento" }} />
        <AppStack.Screen name='DischargeReportPdf' component={DischargeReportPdf} options={{headerBackTitleVisible:false,  headerTitleAlign: "center", headerTitle: "Relatório de alta" }} />

        <AppStack.Screen name='FrequentlyAskedQuestions' component={FrequentlyAskedQuestions} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Guias de Suporte" }} />
        <AppStack.Screen name='ChangeGovLicense' component={ChangeGovLicense} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Meu CRFA" }} />
        <AppStack.Screen name='ChangePhone' component={ChangePhone} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Meu Telefone" }} />

        <AppStack.Screen name='UpdatePacient' component={UpdatePacient} options={{headerBackTitleVisible:false, headerTitleAlign: "center", headerTitle: "Atualizar paciente" }} />

        

      </AppStack.Navigator>
    </>
  )
}

export default PrivateRoutes;
