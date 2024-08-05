import React, { useState } from 'react';
import { List } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";
import { ScrollView } from 'react-native-gesture-handler';

const FrequentlyAskedQuestions = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const faq = [
    { 
      title: "Como cadastrar um paciente?", 
      description: "Vá para 'Pacientes', preencha o formulário de cadastro e atribua suas análises. Depois, atribua os relatórios de análise estrutural e funcional." 
    },
    { 
      title: "Como faço para fazer login?", 
      description: "Para fazer login, clique no botão 'Login' e insira suas credenciais." 
    },
    { 
      title: "Onde encontro meu perfil?", 
      description: "Seu perfil está na guia 'Conta' na página inicial." 
    },
    { 
      title: "Como crio uma consulta?", 
      description: "Vá para 'Acompanhamento' e siga as instruções para selecionar." 
    },
    { 
      title: "Como criar sessão?", 
      description: "Vá para 'Acompanhamento', pesquise um paciente, inicie um atendimento, atribua exercícios para o paciente e clique no botão 'Criar sessão'." 
    },
    { 
      title: "Como ver os questionários?", 
      description: "Os questionários respondidos estão em 'Avaliação fonoaudiologica', onde você verá um resumo." 
    },
   
    { 
      title: "Como compartilhar o app?", 
      description: "Vá para 'Indique', compartilhe o app com seus amigos médicos e indique-os." 
    },
    { 
      title: "Como ver os vídeos do app?", 
      description: "Vá para 'Vídeos' e veja os vídeos de exercícios do app. Nesta seção, você pode ver os vídeos com descrição, objetivo e referências." 
    },
    { 
      title: "Como recuperar minha senha?", 
      description: "Há duas formas: vá para 'Conta' e depois 'Perfil', ou saia do app, clique em 'Esqueci minha senha' e siga os passos enviados por e-mail." 
    },
    { 
      title: "O app está disponível em outros idiomas?", 
      description: "Atualmente, o app está disponível apenas em português, mas adicionaremos mais idiomas futuramente." 
    },
    { 
      title: "Como posso obter ajuda?", 
      description: "Vá para 'Conta' e depois 'Ajuda' para obter assistência." 
    },
    { 
      title: "Como faço para dar uma sugestão?", 
      description: "Vá para 'Conta' e depois 'Sugestão' para enviar suas sugestões." 
    },
    { 
      title: "Como faço para sair da minha conta?", 
      description: "Vá para 'Conta' e clique em 'Sair da conta' para se desconectar." 
    },
    { 
      title: "Como pesquiso meus pacientes?", 
      description: "Vá para 'Acompanhamento' e utilize a função 'Pesquisar paciente' para encontrar seus pacientes." 
    },
    { 
      title: "Como gerar relatórios?", 
      description: "Vá para 'Acompanhamento', pesquise o paciente, clique em 'Gerar relatórios' e siga o passo a passo." 
    }
  ];
  
  
  function handleAccordionPress(index) {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  }

  const renderFAQ = () => {
    return faq.map((item, index) => (
      <List.Accordion
        key={index}
        title={item.title}
        titleStyle={{ color: expandedIndex === index ? "#2a7c6c" : "black" }}
        style={{ backgroundColor: "#E8E8E8", marginBottom: 10 }}
        left={(props) => <AntDesign name="Safety" style={{ top: 5, left: 5 }} color={expandedIndex === index ? "#2a7c6c" : "black"} size={24} />}
        expanded={expandedIndex === index}
        onPress={() => handleAccordionPress(index)}
      >
        <Animatable.View animation="fadeIn" style={{ paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 16, marginBottom:15, right:15 }}>{item.description}</Text>
        </Animatable.View>
      </List.Accordion>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Seção de Perguntas Frequentes */}
      <List.Section title='Perguntas frequentes' titleStyle={{ color: "black", fontSize: 18, marginBottom:10, right: 10 }} style={{ gap: 0 }}>
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
