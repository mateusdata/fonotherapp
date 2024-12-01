import React, { useEffect, useState } from 'react';
import { List } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";
import { ScrollView } from 'react-native-gesture-handler';
import { api } from '../../config/Api';
import LoadingComponent from '../../components/LoadingComponent';

interface FormatFac {
  faq_id: number
  question: string
  response: string
}
const FrequentlyAskedQuestions = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [faq, setFaq] = useState<Array<FormatFac>>()

  async function fetchFaq() {
    try {
      const response = await api.get("/frequent-questions");
      setFaq(response.data.data)
    } catch (error) {
     
    }
  }

  useEffect(() => {
    fetchFaq()
  }, []);

  function handleAccordionPress(index) {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  }

  if (!faq?.length) {
    return (
      <LoadingComponent />
    )
  }

  const renderFAQ = () => {
    return faq?.map((item, index) => (
      <List.Accordion
        key={index}
        title={item.question}
        titleStyle={{ color: expandedIndex === index ? "#2a7c6c" : "black" }}
        titleNumberOfLines={8}
        style={{ backgroundColor: "#E8E8E8", marginBottom: 10 }}
        left={(props) => <AntDesign name="Safety" style={{ top: 5, left: 5 }} color={expandedIndex === index ? "#2a7c6c" : "black"} size={24} />}
        expanded={expandedIndex === index}
        onPress={() => handleAccordionPress(index)}
      >
        <Animatable.View animation="fadeIn" style={{ paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 16, marginBottom: 15, right: 15 }}>{item.response}</Text>
        </Animatable.View>
      </List.Accordion>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Seção de Perguntas Frequentes */}
      <List.Section title='Perguntas frequentes' titleStyle={{ color: "black", fontSize: 18, marginBottom: 10, right: 10 }} style={{ gap: 0 }}>
        {renderFAQ()}
      </List.Section>
    </ScrollView>
  );
};

export default FrequentlyAskedQuestions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
  },
});
