
import React, { useContext, useEffect, useState } from 'react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, List } from 'react-native-paper';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as  Animatable from "react-native-animatable"
import { Sheet } from 'tamagui';
import { number } from 'yup';

import { Context } from '../../context/AuthProvider';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import { background, colorGray, colorGreen, colorPrimary, colorRed, colorSecundary } from '../../style/ColorPalette';
import { ContextGlobal } from '../../context/GlobalContext';
import LabelInput from '../../components/LabelInput';
import ErrorMessage from '../../components/errorMessage';
import { FormatPacient } from '../../interfaces/globalInterface';
import downloadPDF from '../../utils/downloadPDF';
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';
import UpdateAnamnese from '../../components/AnsweredQuestions/UpdateAnamnese';
import Toast from '../../components/toast';

const AnsweredQuestions = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [answered, setAnswered] = useState([]);
  const { pac_id } = useContext(ContextPacient);
  const [pacient, setPacient] = useState<FormatPacient>();
  const { user } = useContext(Context);
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
      console.log(response)
      const getPdf =  await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, user?.token, setLoading)
      console.log(getPdf);
      
    
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

  const renderQuestions = (questions) => {
    return questions.map((question) => (
      <Animatable.View animation="" key={question.que_id} style={{ right: 30, padding: 10 }}>
        <Text style={{ flex: 1, fontSize: 18 }}>{question.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
          {question.alternatives.map((alternative, index) => {
            const isSelected = question.answer && alternative === question.answer.alternative;
            return (
              <Pressable
                key={index}
                style={{ marginRight: 10, right: 7, top: 8, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, backgroundColor: isSelected ? colorGreen : '#fff' }}
                onPress={() => handleAnswerClick(question.que_id, alternative)}
              >
                <Text style={{ color: isSelected ? '#fff' : '#007bff' }}>{alternative}</Text>
              </Pressable>
            );
          })}
        </View>
      </Animatable.View>
    ));
  };

  const renderAnamnese = () => {
    return (
      <Animatable.View animation="" style={styles.anamneseContainer}>
        <View style={{ width: "95%" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={styles.anamneseText}>{`${pacient?.food_profile ? "Doença base:" : "Nâo cadastrado"}  `}</Text>
            <Pressable onPress={() => setModalVisible(true)} android_ripple={{ color: colorPrimary }} style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", }}>
              <Text style={{ textAlign: "center", top: 2 }}>editar</Text>
              <MaterialIcons name="edit-square" size={28} color={"orange"} />
            </Pressable>

          </View>

          <View>
            {pacient.food_profile && <Text numberOfLines={10} style={[styles.anamneseText, styles.blueText]}>{`${pacient?.base_diseases}`}</Text>}
          </View>
        </View>


        {pacient.food_profile &&
          <>
            <View style={{ width: "95%" }}>
              <Text style={styles.anamneseText}>{`Perfil alimentar: `}</Text>
              <Text numberOfLines={10} style={[styles.anamneseText, styles.blueText]}>{`${pacient?.food_profile}`}</Text>
            </View>
            <View style={{ width: "95%" }}>
              <Text style={styles.anamneseText}>{`Queixas de deglutição: `}</Text>
              <Text numberOfLines={10} style={[styles.anamneseText, styles.blueText]}>{`${pacient?.chewing_complaint}`}</Text>
            </View>
            <View style={{ width: "95%" }}>
              <Text style={styles.anamneseText}>{`Educação: `}</Text>
              <Text numberOfLines={10} style={[styles.anamneseText, styles.blueText]}>{`${pacient?.education}`}</Text>
            </View>
            <View style={{ width: "95%" }}>
              <Text style={styles.anamneseText}>{`Motivo da consulta: `}</Text>
              <Text numberOfLines={10} style={[styles.anamneseText, styles.blueText]}>{`${pacient?.consultation_reason}`}</Text>
            </View>

            <View style={{ width: "95%" }}>
              <Text style={styles.anamneseText}>{`Via de alimentação atual: `}</Text>
              <Text numberOfLines={10} style={[styles.anamneseText, styles.blueText]}>{`${pacient?.current_food_intake_method}`}</Text>
            </View>

            
          </>
        }
      </Animatable.View>
    );
  };


  const handleAccordionPress = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };





  if (!pacient && !pacient?.person && !pacient?.first_name && !pacient?.questionnaires) {
    return <SkelectonView />
  }



  return (
    <>
      <ScrollView style={styles.container}>
        <Text> { false &&  JSON.stringify(answered, null, 2)}
        </Text>
        <Pressable onPress={getPdf} style={styles.pressable}>
          <View style={styles.row}>
            <AntDesign name="pdffile1" size={34} color="red" />
            <Text style={styles.text}>{`Relatório de anamnese do paciente ${pacient?.first_name.split(' ')[0]}`}</Text>
          </View>
        </Pressable>
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
                <View key={section.qhs_id}>
                  {renderQuestions(section.questions)}
                </View>
              ))}
            </List.Accordion>
          ))}

        </List.Section>

        <Sheet
          modal
          open={modalVisible}
          dismissOnSnapToBottom
          animation="medium"
          native
          onOpenChange={() => {
            Keyboard.dismiss();
            setSnapPoints(65)
            setModalVisible(false)

          }}
          snapPoints={[snapPoints]}

        >

          <Sheet.Overlay />

          <Sheet.Frame style={{ borderTopEndRadius: 15, borderTopStartRadius: 15 }}>

            <HeaderSheet />

            <ScrollView style={{ backgroundColor: 'transparent' }}>

              <UpdateAnamnese setSnapPoints={setSnapPoints} setModalVisible={setModalVisible} pacient={pacient} setShowToast={setShowToast} />

            </ScrollView>

          </Sheet.Frame>
        </Sheet>


      </ScrollView>

      <Toast visible={showToast} mensage={"Anamnese atualizada"} setVisible={setShowToast} />

    </>
  );
};

export default AnsweredQuestions;

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
