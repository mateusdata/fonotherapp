
import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Card, List } from 'react-native-paper';
import {  Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthProvider';
import { ContextPacient } from '../../context/PacientContext';
import { api } from '../../config/Api';
import { colorGreen, colorPrimary } from '../../style/ColorPalette';
import { FormatPacient } from '../../interfaces/globalInterface';
import downloadPDF from '../../utils/downloadPDF';
import SkelectonView from '../../components/SkelectonView';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const MyComponent = ({ navigation, pacient, answered }) => (
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
       

      <Pressable onPress={() => navigation.navigate("UpdatePatientEvaluation", { pacient: pacient , answered: answered[0]})}>
        <Card.Title
          title="Avaliação estrutural"
          style={{ backgroundColor: "#E8E8E8", borderWidth: 0, padding: 12, borderRadius: 12, }}
          left={(props) => <Avatar.Icon {...props} color={colorPrimary} style={{ backgroundColor: "", }} icon="doctor" />}
          right={(props) => <AntDesign name="right" style={{}} color={colorPrimary} size={22} />}
        />
      </Pressable>

      <Pressable onPress={() => navigation.navigate("UpdatePatientEvaluation", { pacient: pacient , answered: answered[1]})}>

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
  const [answered, setAnswered] = useState([]);
  const { pac_id } = useContext(ContextPacient);
  const [pacient, setPacient] = useState<FormatPacient>();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {    
    const response = await api.get(`/pacient/${pac_id}`);
    setPacient(response.data);
    setLoading(false);

  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      fetchQuestionnaire();
    }, [pac_id])
  );

  


  async function getPdf() {
    try {
      const response: any = await api.get(`/generate-report/${pac_id}`)
      const getPdf = await downloadPDF(response?.data?.doc_url, response?.data?.doc_name, accessToken, setLoading)


    } catch (error) {
      console.error("Ocorreu um erro" + error.message)
      setLoading(false)
    } finally {
      setLoading(false)

    }
  }

 

  const fetchQuestionnaire = async () => {
    try {      

      const response = await api.get(`answered-questionnaire/${pac_id}`);
      console.log(JSON.stringify(response.data[0], null, 2));
      
      setAnswered(response.data);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);

    }
  };
  


  if (loading) {
    return <SkelectonView />
  }



  return (
    <>
      <View style={styles.container}>

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

        <MyComponent navigation={navigation} pacient={pacient} answered={answered} />


      </View>

    

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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});




