import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, ScrollView, Image, BackHandler, Platform, Vibration, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Button, Searchbar, TextInput } from 'react-native-paper';
import * as yup from "yup"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Sheet } from 'tamagui';

import { api } from '../../config/Api'
import { colorPrimary, colorRed, colorSecundary } from '../../constants/ColorPalette'
import { ContextPacient } from '../../context/PacientContext';
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';
import { useAuth } from '../../context/AuthProvider';
import { ContextGlobal, useGlobal } from '../../context/GlobalContext';
import LabelInput from '../../components/LabelInput';
import { videoUrl } from '../../utils/videoUrl';
import Segmenteds from '../../components/Segmenteds';
import { useVideoPlayer, VideoView } from 'expo-video';
import { vibrateFeedback } from '../../utils/vibrateFeedback';
import LinearCustomGradient from '../../components/LinearCustomGradient';
import { heightPercentage } from '../../utils/widthScreen';
import KeyboardView from '../../components/KeyboardView';
import { vibrateFeedbackWarning } from '../../utils/vibrateFeedbackWarning';
import { showToast } from '../../utils/showToast';

export default function Section({ navigation }) {
  const [page, setPage] = useState(1);
  const [videosFono, setVideosFono] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingBottom, setLoadingBottom] = useState(false);

  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [errorInput, setErroInput] = useState("");
  const { user } = useAuth()
  const { pac_id } = useContext(ContextPacient)
  const [search, setSearch] = useState("");
  const [changeList, setChangeList] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [series, setSeries] = useState<any>("");
  const [repetitions, setRepetitions] = useState<any>("");
  const { setThereSession, thereSession } = useGlobal();;
  const [videosType, setVideosType] = useState('degluticao');
  const [currentVideo, setCurrentVideo] = useState(null);

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
      doc_id: user?.doctor?.doc_id,
      ses_id: null,
      name: "",
      description: "sem descrição",
    },
    resolver: yupResolver(schema)
  });


  const [selectedVideo, setSelectedVideo] = useState(null);


  const player = useVideoPlayer(videoUrl + currentVideo?.video_urls[0], player => {
    player.loop = true;
    player.play();
    player.play();
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modalVisible) {
        player.pause();
        setModalVisible(false)
        setCurrentVideo(null)
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

        const response = await api.get(`/list-exercise?pageSize=100&page=${1}&type=${videosType}`);
        setVideosFono(response.data.data);
        // setVideosFono([...videosFono, ...response.data.data]); //mudou aqui
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    };
    fetchVideos();
  }, [page, changeList, videosType]);


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
    setCurrentVideo(uri)
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
      Alert.alert("Ocorreu um error");
      return;
    }

    setValue("exercise_plans", exercisePlans);
    setSeries("");
    setRepetitions("");
  };
  const onSubmit = async (data) => {
    setLoadingBottom(true)
    try {

      await api.post("protocol", data);
      await api.get(`/end-session/${watch("ses_id")}`);
      setLoadingBottom(false)
      setThereSession(true)

      showToast({
        type: "success",
        text1: "Sessão criada",
        position: "bottom"
      });

      vibrateFeedback()
      reset()

    } catch (error) {
      setLoadingBottom(false)
      Alert.alert("Ocorreu um erro")
    }
  };

  const onError = (error) => {


  }


  const createProtocol = async () => {
    setLoadingBottom(true)
    if (!!watch("exercise_plans")?.length) {
      try {
        const session: any = await api.post("/session", { pac_id });
        setValue("ses_id", session.data.ses_id);
        handleSubmit(onSubmit, onError)()
      } catch (error) {
        Alert.alert("Ocoreu um erro")


      }
      return
    }

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    )
    setLoadingBottom(false)
  }
  const onOpenChange = () => {
    setModalVisible(false);
    player.pause();
    setCurrentVideo(null)
  }

  const renderItem = ({ item }) => {
    const isExerciseAdded = watch("exercise_plans")?.some(exercise => exercise?.exe_id === item?.exe_id);
    return (
      <Pressable onLongPress={() => {
        addExercice(item?.exe_id)
      }} onPress={() => {
        handleVideoPress(item);
        setIsVideoPlaying(true);
      }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          marginVertical: 0
        }}>
        <View style={{ padding: 10, flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: 8 }}>
          <AntDesign name="playcircleo" size={30} color={isExerciseAdded ? "orange" : colorPrimary} />
          <Text numberOfLines={3} ellipsizeMode="tail" style={{ flexShrink: 1, padding: 8, color: isExerciseAdded ? "orange" : "black" }}>
            {item?.name}
          </Text>

        </View>
      </Pressable>
    );
  };


  if (loading) {
    return <SkelectonView />
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>

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
          ListHeaderComponent={<Segmenteds videosType={videosType} setVideosType={setVideosType} />}

        />



        <View style={{
          flex: 1,
        }}>
          <Button
            loading={loadingBottom}
            disabled={loadingBottom || !watch().exercise_plans || watch().exercise_plans?.length === 0}
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

      <Sheet
        modal
        open={modalVisible}
        dismissOnSnapToBottom
        animation="medium"
        native
        onOpenChange={onOpenChange}
        snapPointsMode="mixed"
        snapPoints={['fit', "40%"]}
      >

        <Sheet.Overlay />

        <Sheet.Frame maxHeight={heightPercentage} style={{ borderTopEndRadius: 15, borderTopStartRadius: 15 }}>
          <LinearCustomGradient />
          <HeaderSheet />

          <ScrollView contentContainerStyle={{ paddingBottom: 150 }} style={{ backgroundColor: 'transparent', width: "100%" }}>
            <Text style={{ textAlign: "center", fontSize: 18, marginTop: 12, color: colorSecundary, paddingHorizontal: 25 }}>
              {selectedVideo?.name}
            </Text>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <VideoView
                style={{
                  width: "60%", // Usando 80% da largura da tela para o vídeo
                  height: 250,
                  borderRadius: 15,
                  borderWidth: 2,
                  marginTop: 10,
                  borderColor: watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo.exe_id) ? "#38CB89" : "transparent",
                }}
                player={player}
                contentFit={"cover"}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                nativeControls={false}
              />

              <KeyboardView style={{ flexDirection: "row", width: "60%", gap: 10, marginTop: 5, justifyContent: "center" }}>
                {!watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo?.exe_id) && <>
                  <View style={{ flexDirection: "column", width: "45%" }}>
                    <LabelInput value='Séries' />
                    <TextInput
                      contentStyle={{ width: "100%" }} // Ajustando a largura para 100%
                      activeOutlineColor={colorPrimary}
                      mode='outlined'
                      keyboardType='number-pad'
                      style={{ height: 35 }}
                      value={series}
                      placeholder='Ex:3'
                      onChangeText={(text) => {
                        if (/^\d+(\.\d{0,2})?$|^$/.test(text) && (text === "" || parseFloat(text) <= 100)) {
                          setSeries(text);
                        }
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: "column", width: "45%" }}>
                    <LabelInput value='Repetições' />
                    <TextInput
                      contentStyle={{ width: "100%" }} // Ajustando a largura para 100%
                      activeOutlineColor={colorPrimary}
                      mode='outlined'
                      keyboardType='number-pad'
                      style={{ height: 35 }}
                      value={repetitions}
                      placeholder='Ex:15'
                      onChangeText={(text) => {
                        if (/^\d+(\.\d{0,2})?$|^$/.test(text) && (text === "" || parseFloat(text) <= 100)) {
                          setRepetitions(text);
                        }
                      }}
                    />
                  </View>
                </>}

              </KeyboardView>

              <Text style={{ color: "red" }}>{errorInput}</Text>
              <View style={{ width: "50%" }}>
                <Button
                  onPress={() => {
                    addExercice(selectedVideo?.exe_id)
                    vibrateFeedbackWarning()
                  }}
                  style={{ marginTop: 5 }}
                  textColor='white'
                  buttonColor={`${watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo?.exe_id) ? colorRed : colorPrimary}`}
                  mode='contained-tonal'>
                  {`${watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo?.exe_id) ? "Remover exercício" : "Adicionar"}`}
                </Button>
              </View>
            </View>

            {!isVideoLoading && <View style={{ width: "100%", paddingTop: 5, paddingHorizontal: 25 }}>
              {selectedVideo?.description && <Text style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Descrição</Text>}
              <Text style={{ textAlign: "justify", fontSize: 15 }}>{selectedVideo?.description}</Text>

              {selectedVideo?.objective && <Text style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Objetivo</Text>}
              <Text style={{ textAlign: "justify", fontSize: 15 }}>{selectedVideo?.objective}</Text>

              {selectedVideo?.academic_sources && <Text style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Referências</Text>}
              <Text style={{ textAlign: "justify", fontSize: 12 }}>{`" ${selectedVideo?.academic_sources} "`}</Text>
            </View>}
          </ScrollView>

        </Sheet.Frame>
      </Sheet>
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