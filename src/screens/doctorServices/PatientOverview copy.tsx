
import React, { useContext, useEffect, useState } from 'react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Button, List } from 'react-native-paper';
import { Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

const PatientOverview = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [answered, setAnswered] = useState([]);
  const { pac_id } = useContext(ContextPacient);
  const [pacient, setPacient] = useState<FormatPacient>();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [questionnaireId, setQuestionareId] = useState<number>(null)
  const [snapPoints, setSnapPoints] = useState<number>(65)

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/pacient/${pac_id}`);
      setPacient(response.data);

    };
    fetchData();
  }, [pac_id, showToast]);

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
      console.log(response.data);
      
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

  const renderQuestions = (questions) => {
    return questions.map((question) => (
      <View key={question.que_id} style={{ right: 0, padding: 10, }}>
        {false && <Text>{JSON.stringify(questions, null, 2)}</Text>}
        <Text style={{ flex: 1, fontSize: 18 }}>{question.name}</Text>
        <View style={{ alignItems: 'flex-start', flexDirection:"column"}}>
          {question.alternatives.map((alternative, index) => {
            const isSelected = question.answer && alternative === question.answer.alternative;
            return (
              <Pressable
                key={index}
                style={{ marginRight: 10, right: 7, top: 8, padding:10, borderRadius: 10, backgroundColor: isSelected ? colorGreen : '#fff' }}
                onPress={() => handleAnswerClick(question.que_id, alternative)}
              >
                <Text style={{ color: isSelected ? '#fff' : '#007bff', fontSize:18 }}>{alternative}</Text>
                
              </Pressable>
            );
          })}
        </View>
      </View>
    ));
  };

  const renderAnamnese = () => {
    return (
       <Anamnese  pacient={pacient} setShowToast={setShowToast}/>
    );
  };


  const handleAccordionPress = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };


  if (!pacient && !pacient?.person && !pacient?.name && !pacient?.questionnaires) {
    return <SkelectonView />
  }



  return (
    <>
      <ScrollView style={styles.container}>
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



          <Pressable onPress={() => navigation.navigate("PacientEvolution", {pac_id:pac_id})}>
            <Button buttonColor={colorPrimary} mode='elevated' textColor='white' >
              Evolução Diária
            </Button>
          </Pressable>

        </View>

        {loading && <ActivityIndicator size="small" color={colorPrimary} />}


        <List.Section title='Perguntas respondidas' titleStyle={{ color: "black", fontSize: 15, right: 10 }} style={{ gap: 0, }}>
          <List.Accordion
            title="Anamnese"
            titleStyle={{ color: expandedIndex === 0 ? colorGreen : "#2a7c6c" }}
            style={{ backgroundColor: "#E8E8E8", marginBottom: 10 }}
            left={(props) => <AntDesign name="Safety" style={{ top: 5, left: 5 }} color={expandedIndex === 0 ? colorGreen : "#2a7c6c"} size={24} />}
            expanded={expandedIndex === 0}
            onPress={() => handleAccordionPress(0)}>
            {renderAnamnese()}
          </List.Accordion>

          <ScrollView >
            {answered && answered.map((item, index) => (
              <List.Accordion
                key={index + 1}
                titleStyle={{ color: expandedIndex === index + 1 ? colorGreen : "#2a7c6c" }}

                title={item.name}
                style={{ backgroundColor: "#E8E8E8", marginBottom: 10 }}
                left={(props) => <AntDesign name="Safety" style={{ top: 5, left: 5 }} color={expandedIndex === index + 1 ? colorGreen : "#2a7c6c"} size={24} />}
                expanded={expandedIndex === index + 1}
                onPress={() => {
                  setQuestionareId(item?.qus_id)
                  handleAccordionPress(index + 1)
                }}>
                {item.sections.map((section) => (
                  <ScrollView style={{ width: "100%", right: 22, }} key={section.qhs_id}>
                    {renderQuestions(section.questions)}
                  </ScrollView>
                ))}
              </List.Accordion>
            ))}
          </ScrollView>

        </List.Section>

       
      </ScrollView>

      <Toast visible={showToast} mensage={"Anamnese atualizada"} setVisible={setShowToast} />

    </>
  );
};

export default PatientOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
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
