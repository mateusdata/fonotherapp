
import React, { useContext, useEffect, useState } from 'react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Avatar, Button, Card, IconButton, List } from 'react-native-paper';
import { Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as  Animatable from "react-native-animatable"
import { Sheet } from 'tamagui';
import { number } from 'yup';

import { Context } from '../../context/AuthProvider';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import { colorGreen, colorPrimary, colorRed, colorSecundary } from '../../style/ColorPalette';
import { FormatPacient } from '../../interfaces/globalInterface';
import downloadPDF from '../../utils/downloadPDF';
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';
import Toast from '../../components/toast';
import KeyboardView from '../../components/KeyboardView';
import Anamnese from './Anamnese';


import { MD3Colors, } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const MyComponent = ({ navigation, pacient }) => (
  <View style={styles2.container}>
    <List.Section style={{ gap: 12 }}>
      <List.Subheader style={styles2.subheader}>Quadro atual</List.Subheader>
      <Pressable onPress={() => navigation.navigate("Anamnese", { pacient: pacient })}>
        <Card.Title
          title="Anamnese"
          style={{ backgroundColor: "#E8E8E8", borderWidth: 0, padding: 12, borderRadius: 12, }}
          left={(props) => <Avatar.Icon {...props} color={colorPrimary} style={{ backgroundColor: "", }} icon="hospital" />}
          right={(props) => <AntDesign name="right" style={{}} color={colorPrimary} size={22} />}
        />
      </Pressable>
       

      <Pressable onPress={() => navigation.navigate("StructuralAnalysisUpdate", { pacient: pacient })}>
        <Card.Title
          title="Avaliação estrutural"
          style={{ backgroundColor: "#E8E8E8", borderWidth: 0, padding: 12, borderRadius: 12, }}
          left={(props) => <Avatar.Icon {...props} color={colorPrimary} style={{ backgroundColor: "", }} icon="doctor" />}
          right={(props) => <AntDesign name="right" style={{}} color={colorPrimary} size={22} />}
        />
      </Pressable>

      <Pressable onPress={() => navigation.navigate("FunctionalAnalysisUpdate", { pacient: pacient })}>

        <Card.Title
          title="Avaliação funcional"
          style={{ backgroundColor: "#E8E8E8", borderWidth: 0, padding: 12, borderRadius: 12, }}
          left={(props) => <Avatar.Icon {...props} color={colorPrimary} style={{ backgroundColor: "", }} icon="thermometer" />}
          right={(props) => <AntDesign name="right" style={{}} color={colorPrimary} size={22} />}
        />
      </Pressable>

    </List.Section>
  </View>
);

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: 'white',
    gap: 2
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    gap: 120
  },
  item: {
    paddingVertical: 16,
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  title: {
    fontSize: 20,
    color: colorPrimary
  },
});





const AnsweredQuestions = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [answered, setAnswered] = useState([]);
  const { pac_id } = useContext(ContextPacient);
  const [pacient, setPacient] = useState<FormatPacient>();
  const { accessToken } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [questionnaireId, setQuestionareId] = useState<number>(null)
  const [snapPoints, setSnapPoints] = useState<number>(65)


  const fetchData = async () => {
    const response = await api.get(`/pacient/${pac_id}`);
    setPacient(response.data);

  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [pac_id, showToast])
  );

  useEffect(() => {
    fetchQuestionnaire();
  }, [pac_id]);


  async function getPdf() {
    try {
      setLoading(true);
      const response: any = await api.get(`/generate-report/${pac_id}`)

      const getPdf = await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, accessToken, setLoading)



    } catch (error) {
      console.error("Ocorreu um erro" + error.message)
      setLoading(false)
    } finally {
      setLoading(false)

    }
  }

  const handleAnswerClick = async (questionId, alternative) => {
    try {

      const updatedQuestionnaire = {
        pac_id,
        answers: [
          {
            que_id: questionId,
            alternative: alternative,
          },
        ],
      };

      const response = await api.post(`/update-questionnaire`, updatedQuestionnaire);
      fetchQuestionnaire()
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
    }
  };

  const fetchQuestionnaire = async () => {
    try {
      const response = await api.get(`answered-questionnaire/${pac_id}`);
      const sortedData = response.data.sort((a, b) => {
        if (a.name === "Análise Funcional") return -1;
        if (b.name === "Análise Funcional") return 1;
        if (a.name === "Análise Estrutural") return -1;
        if (b.name === "Análise Estrutural") return 1;
        return 0;
      });
      setAnswered(sortedData);
    } catch (error) {
      console.error(error);
    }
  };








  if (loading && !pacient && !pacient?.person && !pacient?.name && !pacient?.questionnaires) {
    return <SkelectonView />
  }



  return (
    <>
      <View style={styles.container}>
        <Text> {false && JSON.stringify(answered, null, 2)}
        </Text>

        <View style={{ gap: 8 }}>
          <Pressable onPress={getPdf}>
            <Button
              icon={(props) => <AntDesign name="pdffile1" size={23} color="white" />}
              buttonColor={colorPrimary} mode='elevated' textColor='white' >
              {`Relatório de Avaliação do paciente ${pacient?.name.split(' ')[0]}`}
            </Button>
          </Pressable>



          <Pressable onPress={() => navigation.navigate("PacientEvolution", { pac_id: pac_id })}>
            <Button buttonColor={colorPrimary} mode='elevated' textColor='white' >
              Evolução Diária
            </Button>
          </Pressable>

        </View>

        <MyComponent navigation={navigation} pacient={pacient} />


      </View>

      <Toast visible={showToast} mensage={"Anamnese atualizada"} setVisible={setShowToast} />

    </>
  );
};

export default AnsweredQuestions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10
  },
  anamneseContainer: {
    padding: 10,
    marginHorizontal: -18,
    marginVertical: 5,

  },
  anamneseText: {
    fontSize: 18,
    marginBottom: 5,
  },
  blueText: {
    color: colorGreen,
  },
  pressable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});




