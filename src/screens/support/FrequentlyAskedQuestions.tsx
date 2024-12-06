import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from '@tamagui/lucide-icons';
import { Accordion, Paragraph, Square, YStack } from 'tamagui';
import { ScrollView } from 'react-native-gesture-handler';
import { api } from '../../config/Api';
import LoadingComponent from '../../components/LoadingComponent';
import { colorPrimary } from '../../style/ColorPalette';

interface FormatFac {
  faq_id: number;
  question: string;
  response: string;
}

export default function FrequentlyAskedQuestions() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [faq, setFaq] = useState<Array<FormatFac>>([]);

  async function fetchFaq() {
    try {
      const response = await api.get("/frequent-questions");
      setFaq(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar perguntas frequentes:', error);
    }
  }

  useEffect(() => {
    fetchFaq();
  }, []);

  function handleAccordionPress(index: number) {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  if (!faq.length) {
    return <LoadingComponent />;
  }

  const renderFAQ = () => {
    return faq.map((item, index) => (
      <Accordion.Item key={index} value={`faq-${index}`}>
        <Accordion.Trigger flexDirection="row" justifyContent="space-between" alignItems="center" paddingVertical="$3" paddingHorizontal="$4" backgroundColor="#fff" borderRadius="$3" marginBottom="$2" style={styles.accordionItem}>
          {({ open }) => (
            <>
              <Paragraph  color={open ? "#2a7c6c" : "#333"}>{item.question}</Paragraph>
              <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                <ChevronDown size="$1" color={open ? "#2a7c6c" : "#333"} />
              </Square>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.HeightAnimator>
          <Accordion.Content paddingHorizontal="$4" paddingVertical="$3" backgroundColor="#f9f9f9" borderRadius="$3">
            <Paragraph>{item.response}</Paragraph>
          </Accordion.Content>
        </Accordion.HeightAnimator>
      </Accordion.Item>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <YStack padding={5} width="95%">
        <Text style={styles.title}>Perguntas frequentes</Text>
        <Accordion type="single" collapsible>
          {renderFAQ()}
        </Accordion>
      </YStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
  },
  title: {
    color: colorPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  accordionItem: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

