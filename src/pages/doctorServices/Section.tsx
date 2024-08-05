import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, ScrollView, Image, BackHandler } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';

import { ActivityIndicator, Button, FAB, Modal, Searchbar, TextInput } from 'react-native-paper';
import { Dialog } from 'tamagui';
import dayjs from 'dayjs';
import * as yup from "yup"
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Sheet } from 'tamagui';

import { api } from '../../config/Api'
import CustomText from '../../components/customText'
import { colorGreen, colorPrimary, colorRed, colorSecundary } from '../../style/ColorPalette'
import ErrorMessage from '../../components/errorMessage'
import { ContextPacient } from '../../context/PacientContext';
import { FormatPacient } from '../../interfaces/globalInterface';
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';
import { Context } from '../../context/AuthProvider';
import { ContextGlobal } from '../../context/GlobalContext';
import { urlPosterSouce } from '../../utils/urlPosterSource';
import LabelInput from '../../components/LabelInput';
import Toast from '../../components/toast';
import { videoUrl } from '../../utils/videoUrl';

export default function Section({ navigation }) {
  const [page, setPage] = useState(1);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [mensageToast, setMensageToast] = useState<string>("");
  const [videosFono, setVideosFono] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingBottom, setLoadingBottom] = useState(false);

  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [errorInput, setErroInput] = useState("");
  const { user } = useContext(Context)
  const { pac_id } = useContext(ContextPacient)
  const [search, setSearch] = useState("");
  const [changeList, setChangeList] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [series, setSeries] = useState<any>("");
  const [repetitions, setRepetitions] = useState<any>("");
  const { setThereSession, thereSession } = useContext(ContextGlobal);

  const schema = yup.object().shape({
    doc_id: yup.number(),
    ses_id: yup.number(),
    name: yup.string().max(150),
    description: yup.string().max(255),
    exercise_plans: yup.array().of(
      yup.object().shape({
        exe_id: yup.number(),
        series: yup.number(),
        repetitions: yup.number(),
      })
    ).required(),
  });
  const { control, formState: { errors }, watch, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      doc_id: user.doc_id,
      ses_id: null,
      name: "Sessão - " + dayjs(new Date()).format("DD-MM-YYYY-HH-mm-ss-SSS"),
      description: "sem descrição",
    },
    resolver: yupResolver(schema)
  });


  const [selectedVideo, setSelectedVideo] = useState(null);


  useEffect(() => {

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setIsVideoPlaying(false)
      if (modalVisible) {
        setModalVisible(false)
        return true
      }
      return false;
    });

    return () => backHandler.remove();
  }, [modalVisible]);

  useEffect(() => {
    if (search === "") {
      setVideosFono([])
      setChangeList(!changeList);
      setPage(1)
    }
  }, [search]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(`/list-exercise?pageSize=15&page=${page}`);

        setVideosFono([...videosFono, ...response.data.rows]);
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    };
    fetchVideos();
  }, [page, changeList]);


  const seachVideos = async () => {

    try {
      const response = await api.post(`/search-exercise`, { search });
      setVideosFono(response.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setChangeList(!changeList)
    }
  }


  const handleEndReached = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleVideoPress = (uri) => {
    setSelectedVideo(uri);
    setModalVisible(true);
  };

  const addExercice = (exe_id: number) => {
    let exercisePlans = watch("exercise_plans") || [];
    const exerciseIndex = exercisePlans.findIndex(exercise => exercise?.exe_id === exe_id);

    if (exerciseIndex !== -1) {
      // Remove exercise
      exercisePlans.splice(exerciseIndex, 1);
    } else if (series && repetitions) {
      // Add exercise
      const data = {
        exe_id,
        series,
        repetitions
      };
      exercisePlans = [...exercisePlans, data];
    } else {
      setMensageToast("Ocorreu um error");
      setShowToast(true);
      return;
    }

    setValue("exercise_plans", exercisePlans);
    setSeries("");
    setRepetitions("");
  };
  const onSubmit = async (data) => {
    setLoadingBottom(true)
    try {

      const response: any = await api.post("protocol", data);
      setLoadingBottom(false)
      setThereSession(true)

      setMensageToast("Sessão criado com sucesso 🥳🎉🎉")
      setShowToast(true)
      reset()

    } catch (error) {
      setLoadingBottom(false)
      setMensageToast(!error.response ? "Sem conexão com a internet" : "Erro ao criar sessão")
      setShowToast(true)
      console.log(error);


    }
  };

  const onError = (error) => {
    setMensageToast("Error: atribua um exercicio")
    setShowToast(true)
  }


  const createProtocol = async () => {
    
    if (!!watch("exercise_plans")?.length) {
      try {
        const session: any = await api.post("/session", { pac_id });
        setValue("ses_id", session.data.ses_id);
        handleSubmit(onSubmit, onError)()
      } catch (error) {
        setMensageToast("Ocoreu um erro")
        setShowToast(true)
        console.log(error);

      }
      return
    }
    setMensageToast("Error: atribua um exercicio")
    setShowToast(true)

  }


  const renderItem = ({ item }) => {
    const isExerciseAdded = watch("exercise_plans")?.some(exercise => exercise?.exe_id === item.exe_id);
    return (
      <Pressable onLongPress={() => {
        addExercice(item.exe_id)
      }} onPress={() => {
        handleVideoPress(item);
        setIsVideoPlaying(true);
      }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isExerciseAdded ? "#38CB89" : "#d2d4db",
          marginVertical: 5
        }}>
        <View style={{ padding: 10, flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: 8 }}>
          <AntDesign name="playcircleo" size={30} color={isExerciseAdded ? "white" : colorPrimary} />
          <Text style={{ color: isExerciseAdded ? "white" : "black" }}>{item?.name}</Text>
        </View>
      </Pressable>
    );
  };


  if (loading) {
    return <SkelectonView />
  }
  return (
    <View style={{ flex: 1 }}>

      <View onTouchMove={() => { }} style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 5 }}>
        <Searchbar
          onChange={seachVideos}
          onChangeText={(e) => setSearch(e)}
          value={search}
          placeholder="Pesquisar videos"
          mode='bar'
          inputMode='search'
          selectionColor={"gray"}
          cursorColor={"gray"}
          style={{ marginBottom: 10 }}

        />

        <FlatList
          data={videosFono}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderItem({ item })}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />

        <Sheet
          modal
          open={modalVisible}
          dismissOnSnapToBottom
          animation="medium"
          native
          onOpenChange={() => {
            setModalVisible(false);
            setIsVideoPlaying(false)
          }
          }
          snapPoints={[75]}>

          <Sheet.Overlay />

          <Sheet.Frame style={{ borderTopEndRadius: 15, borderTopStartRadius: 15 }}>

            <HeaderSheet />


            <ScrollView style={{ backgroundColor: 'transparent', maxWidth: "100%", minWidth: "100%", }}>
              <CustomText style={{ textAlign: "center", fontSize: 18, marginTop: 12, color: colorSecundary, paddingHorizontal: 25 }}>{selectedVideo?.name}</CustomText>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Video
                  style={{ width: "50%", height: 200, borderRadius: 15, borderWidth: 2, borderColor: watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo.exe_id) ? "#38CB89" : "transparent" }} source={{ uri: videoUrl + selectedVideo?.video_urls[0] }}
                  resizeMode={ResizeMode.STRETCH}
                  onLoadStart={() => setIsVideoLoading(true)}
                  isLooping={true}
                  key={selectedVideo?.exe_id}
                  usePoster={isVideoLoading}
                  posterSource={{ uri: urlPosterSouce }}
                  shouldPlay={isVideoPlaying}
                  posterStyle={{ justifyContent: "center", flex: 1, alignItems: "center", height: 100, top: 110, width: "100%" }}

                  onLoad={() => setIsVideoLoading(false)}

                />

                <View style={{ flexDirection: "column", width: "50%", gap: 1, marginTop: 5 }}>

                  {!watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo.exe_id) && <>

                    <LabelInput value='Series' />
                    <TextInput
                      
                      mode='outlined'
                      keyboardType='numeric'
                      style={{ width: "auto", height: 35 }}
                      value={series}
                      onChangeText={(event) => setSeries(event)}
                    />

                    <LabelInput value='Repetições' />
                    <TextInput
                      
                      mode='outlined'
                      keyboardType='numeric'
                      style={{ width: "auto", height: 35 }}
                      value={repetitions}
                      onChangeText={(event) => setRepetitions(event)}
                    />
                  </>}
                </View>

                <Text style={{ color: "red" }}>{errorInput}</Text>
                <View style={{ width: "50%" }}>
                  <Button onPress={() => addExercice(selectedVideo.exe_id)} style={{ marginTop: 5 }}
                    textColor='white' buttonColor={`${watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo.exe_id) ? colorRed : colorPrimary}`} mode='contained-tonal' >
                    {`${watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo.exe_id) ? "Remover exercicio" : "Adicionar"}`}
                  </Button>
                </View>
              </View>

              {!isVideoLoading && <View style={{ width: "100%", paddingTop: 5, paddingHorizontal: 25 }}>
                {selectedVideo?.description && <CustomText style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Descrição</CustomText>}
                <CustomText style={{ textAlign: "justify", fontSize: 15 }}>{selectedVideo?.description}</CustomText>

                {selectedVideo?.objective && <CustomText style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Objetivo</CustomText>}
                <CustomText style={{ textAlign: "justify", fontSize: 15 }}>{selectedVideo?.objective}</CustomText>

                {selectedVideo?.academic_sources && <CustomText style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Referências</CustomText>}
                <CustomText fontFamily='Poppins_200ExtraLight_Italic' style={{ textAlign: "justify", fontSize: 12 }}>{`" ${selectedVideo?.academic_sources} "`}</CustomText>
              </View>}

            </ScrollView>

          </Sheet.Frame>
        </Sheet>

        <View style={{
          flex: 1,
        }}>
          <Button
            loading={loadingBottom}
            disabled={loadingBottom}
            textColor='white'
            style={{
              height: 40,
              position: 'absolute',
              margin: 16,
              right: 0,
              bottom: 0,
              backgroundColor: loadingBottom ? "gray" : '#36B3B9',
            }}
            icon="plus"
            onPress={() => createProtocol()}
          >
            Criar sessão
          </Button>
        </View>
      </View>

      <Toast visible={showToast} mensage={mensageToast} setVisible={setShowToast} bottom={65} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  video: {
    alignSelf: 'center',
    width: 275,
    height: 350,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    margin: 15,
    backgroundColor: '#f5f5f5',
    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  video1: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    margin: 15,
    backgroundColor: '#f5f5f5',
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
});