import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, ScrollView, Text, Alert, Platform } from "react-native";
import { Button, RadioButton, TextInput } from "react-native-paper";
import { z } from "zod";
import { useFocusEffect } from '@react-navigation/native';
import { registerAnimation } from "react-native-animatable";
import { Context } from '../../context/AuthProvider'
import { ContextGlobal } from '../../context/GlobalContext'
import downloadPDF from '../../utils/downloadPDF'
import { api } from '../../config/Api'
import CustomText from '../../components/customText'
import { colorPrimary, colorSecundary } from '../../style/ColorPalette'
import ErrorMessage from '../../components/errorMessage'
import { ContextPacient } from "../../context/PacientContext";
import LoadingComponent from "../../components/LoadingComponent";
import SkelectonView from "../../components/SkelectonView";
import Toast from "../../components/toast";
import LabelInput from "../../components/LabelInput";

const PatientAnalysis = ({ navigation }) => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const { control, handleSubmit } = useForm();
  const [analysis, setAnalysis] = useState<any>({});
  const { pac_id, pacient } = useContext(ContextPacient);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [nextQuestinnaire, setnextQuestinnaire] = useState(false);
  const [loading, setLoading] = useState<boolean>(false)
  const { setIsFromRegistration, isFromRegistration } = useContext(ContextGlobal)



  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true)
          const response = await api.get(`/next-questionnaire/${pac_id}`);
          setAnalysis(response.data);
          console.log(analysis)
          setIsLoading(false);

        } catch (error) {
          if (error?.response?.status === 404) {
            navigation.navigate(isFromRegistration ? "Root" : "Protokol");
          }
          setIsLoading(false);
        }
      };
      fetchData();
    }, [nextQuestinnaire, isFromRegistration])
  );


  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: analysis?.name ? analysis?.name : "", headerShown: isFromRegistration ? false : true });
  }, [analysis?.name, isFromRegistration]);

  const answerSchema = z.object({
    pac_id: z.number().int().positive(),
    answers: z.array(z.object({
      que_id: z.number().int().positive(),
      alternative: z.string().max(150),
      comment: z.string().max(300, "Comentario muito grande").nullish()
    })).min(1)
  });


  if (isFromRegistration) {
    return <LoadingComponent />;
  }
  if (isLoading) {
    return <>
    
      <SkelectonView delay={100} />
    </>;
  }


  if (false) {
    return (
      <ScrollView>
        <Text>
          {JSON.stringify(analysis, null, 2)}
        </Text>
      </ScrollView>
    )
  }

  const onSubmit = async () => {
    let formattedAnswers: any = Object.values(selectedAnswers).map((answer: any) => ({
      que_id: answer.qus_id,
      alternative: answer.value
    }));

    let data: any = {
      pac_id: pac_id,
      answers: formattedAnswers
    };
    try {
      setLoading(true)
      answerSchema.parse(data); // Validate data against schema
      const response = await api.post("/answer-questionnaire", data);
      console.log("Seu estado de logogado via resgisto esta => ", isFromRegistration)
      setAnalysis({});
      setSelectedAnswers({});
      setnextQuestinnaire(!nextQuestinnaire);
      setLoading(false)

    } catch (error) {
      console.log("error", error);
      setLoading(false)
      Alert.alert("Ocorreu um error", "Não foi possivel cadastrar essas perguntas")
      if (!error.response) {
        setShowToast(true)
      }
    }
  };

  return (
    <View style={{ padding: 15, flex: 1 }}>

      <ScrollView style={{ flex: 0.9, marginBottom: 50 }}>
        {analysis?.sections?.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ borderBottomWidth: 1 }}>
            <Text style={{ paddingBottom: 15 }}>{section.name}</Text>
            {section?.questions?.map((question, questionIndex) => (
              <View key={questionIndex}>
                <RadioButton.Group
                  onValueChange={(selectedValue) => setSelectedAnswers((prevAnswers) => ({
                    ...prevAnswers,
                    [question.que_id]: {
                      qus_id: question.que_id,
                      name: question.name,
                      value: selectedValue,
                    }
                  }))}
                  value={selectedAnswers[question.que_id]?.value ?? null}
                >
                  <CustomText fontFamily="Poppins_500Medium">{question.name}</CustomText>
                  {question?.alternatives?.map((alternative, alternativeIndex) => (
                    <RadioButton.Item
                      key={alternativeIndex}
                      color={colorPrimary}
                      label={alternative}
                      value={alternative}
                    />
                  ))}
                </RadioButton.Group>

              {question?.has_comments  &&  <Text style={{left:2, padding:2, fontSize:15, paddingBottom:10}}>{question?.comment_statement}</Text>}
                <View style={{ justifyContent:"center", alignItems:"center"}}>
                  {question?.has_comments &&
                    <TextInput
                      style={{ width: "96%", marginBottom:16 }}                      
                      mode="outlined"
                      dense
                    />
                  }
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>


      <View style={{
        position: "absolute",
        margin: Platform.OS === "ios" ? 16 : 28,
        right: Platform.OS === "ios" ? 6 : 0,
        bottom: Platform.OS === "ios" ? 15 : 0, flex: 1
      }}>
        <Button icon="arrow-right"
          disabled={loading} loading={loading} buttonColor='#36B3B9' mode="contained" onPress={handleSubmit(onSubmit)}>
          Próximo
        </Button>
      </View>
      <Toast visible={showToast} mensage={"Atribua pelo menos um campo"} setVisible={setShowToast} duration={2000} />

    </View>
  );
};

export default PatientAnalysis;