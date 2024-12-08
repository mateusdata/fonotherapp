import React, { useLayoutEffect, useState } from "react";
import { Text, View, ScrollView, Platform, Alert, ToastAndroid } from "react-native";
import { Button, RadioButton, TextInput } from "react-native-paper";
import { api } from "../../config/Api";
import { useAuth } from "../../context/AuthProvider";
import { vibrateFeedback } from "../../utils/vibrateFeedback";
import { colorGreen, colorPrimary, colorSecundary } from "../../style/ColorPalette";
import { vibrateFeedbackWarning } from "../../utils/vibrateFeedbackWarning";
import { vibrateFeedbackError } from "../../utils/vibrateFeedbackError";
import { showToast } from "../../utils/showToast";

export default function UpdatePatientEvaluation({ navigation, route }) {
  const { pacient, answered } = route.params;
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: answered?.name ? answered?.name : "", headerShown: true });
    // Inicializar o estado selectedAnswers com as respostas existentes
    const initialAnswers = {};
    answered.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.answer) {
          initialAnswers[question.que_id] = {
            value: question.answer.alternative,
            comment: question.answer.comment || "",
          };
        }
      });
    });
    setSelectedAnswers(initialAnswers);
  }, [answered?.name]);

  const handleAnswerClick = (questionId, alternative, comment = null) => {
    setSelectedAnswers(prevState => ({
      ...prevState,
      [questionId]: { value: alternative, comment: comment !== null ? comment : prevState[questionId]?.comment }
    }));
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const updatedQuestionnaire = {
        pac_id: pacient.pac_id,
        answers: Object.keys(selectedAnswers).map(key => ({
          que_id: parseInt(key),
          alternative: selectedAnswers[key].value,
          comment: selectedAnswers[key].comment || null,
        })),
      };
      // return alert(JSON.stringify(updatedQuestionnaire, null, 2));
      await api.post('/update-questionnaire', updatedQuestionnaire);
      vibrateFeedback()
      console.log("Respostas enviadas:", updatedQuestionnaire);
      showToast({
        type: "success",
        text1: `${answered?.name} atualizada`,
        position: "bottom"
      });
      

    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} style={{ flex: 1, marginBottom: 50 }}>
        <Text>{false && JSON.stringify(answered, null, 2)}</Text>

        {answered?.sections?.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ borderBottomWidth: 1, marginBottom: 16 }}>
            <Text style={{ paddingBottom: 15, fontWeight: "bold" }}>{section.name}</Text>
            {section?.questions?.map((question, questionIndex) => (
              <View key={questionIndex} style={{ marginBottom: 20 }}>
                <RadioButton.Group
                  onValueChange={(selectedValue) => {
                    vibrateFeedbackWarning()
                    handleAnswerClick(
                      question.que_id,
                      selectedValue,
                      selectedAnswers[question?.que_id]?.comment
                    )
                  }
                  }
                  value={selectedAnswers[question.que_id]?.value ?? null}
                >
                  <Text style={{ fontSize: 16, marginBottom: 10 }}>{question.name}</Text>
                  {question?.alternatives?.map((alternative, alternativeIndex) => (
                    <RadioButton.Item
                      uncheckedColor={"black"}
                      mode="android"
                      background={{ color: colorPrimary, }}

                      key={alternativeIndex}
                      color={colorPrimary}
                      label={alternative}
                      value={alternative}
                    />
                  ))}
                </RadioButton.Group>

                {question?.has_comments && (
                  <>
                    <Text style={{ fontSize: 15, paddingVertical: 10 }}>{question?.comment_statement}</Text>

                    <TextInput
                      dense
                      mode="outlined"
                      activeOutlineColor="#36B3B9"
                      value={selectedAnswers[question.que_id]?.comment || ""}
                      onChangeText={(comment) =>
                        handleAnswerClick(question.que_id, selectedAnswers[question.que_id]?.value, comment)
                      }
                      style={{
                        width: "96%",
                        borderColor: "#ccc",
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 8,
                        marginBottom: 16,
                      }}
                      placeholder="Adicionar comentário"
                    />
                  </>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          margin: Platform.OS === "ios" ? 16 : 28,
          right: Platform.OS === "ios" ? 6 : 0,
          bottom: Platform.OS === "ios" ? 15 : 0,
          flex: 1,
        }}
      >
        <Button
          icon="update"
          disabled={loading}
          loading={loading}
          buttonColor="#36B3B9"
          mode="contained"
          onPress={handleSaveAll}
        >
          Atualizar
        </Button>
      </View>
    </View>
  );
}
