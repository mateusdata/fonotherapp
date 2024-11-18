import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, ScrollView, Image, BackHandler, Platform, Vibration } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Button, Searchbar, TextInput } from 'react-native-paper';
import * as yup from "yup"
import {  useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Sheet } from 'tamagui';

import { api } from '../../config/Api'
import CustomText from '../../components/customText'
import { colorPrimary, colorRed, colorSecundary } from '../../style/ColorPalette'
import { ContextPacient } from '../../context/PacientContext';
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';
import { Context } from '../../context/AuthProvider';
import { ContextGlobal } from '../../context/GlobalContext';
import LabelInput from '../../components/LabelInput';
import Toast from '../../components/toast';
import { videoUrl } from '../../utils/videoUrl';
import Segmenteds from '../../components/Segmenteds';
import { useVideoPlayer, VideoView } from 'expo-video';
import { vibrateFeedback } from '../../utils/vibrateFeedback';

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

      await api.post("protocol", data);
      await api.get(`/end-session/${watch("ses_id")}`);
      setLoadingBottom(false)
      setThereSession(true)

      setMensageToast("Sessão criada")
      vibrateFeedback()
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
    setLoadingBottom(true)
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
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    )
    setShowToast(true)
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
          <Text style={{ color: isExerciseAdded ? "orange" : "black" }}>{item?.name}</Text>
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
      <Sheet
        modal={Platform.OS === "ios" ? false : true}
        open={modalVisible}
        dismissOnSnapToBottom
        animation="medium"
        native
        onOpenChange={onOpenChange}
        snapPoints={[Platform.OS === "ios" ? 95 : 80]}
      >

        <Sheet.Overlay />

        <Sheet.Frame style={{ borderTopEndRadius: 15, borderTopStartRadius: 15 }}>

          <HeaderSheet />


          <ScrollView style={{ backgroundColor: 'transparent', maxWidth: "100%", minWidth: "100%", }}>
            <CustomText style={{ textAlign: "center", fontSize: 18, marginTop: 12, color: colorSecundary, paddingHorizontal: 25 }}>{selectedVideo?.name}</CustomText>
            <View style={{ justifyContent: "center", alignItems: "center" }}>

              <VideoView
                style={{ width: "50%", height: 200, borderRadius: 15, borderWidth: 2, borderColor: watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo.exe_id) ? "#38CB89" : "transparent" }}
                player={player}
                contentFit={"cover"}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                nativeControls={false}

              />

              <View style={{ flexDirection: "column", width: "50%", gap: 1, marginTop: 5 }}>
                {!watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo?.exe_id) && <>

                  <LabelInput value='Series' />
                  <TextInput
                    activeOutlineColor={colorPrimary}
                    mode='outlined'
                    keyboardType='numeric'
                    style={{ width: "auto", height: 35 }}
                    value={series}
                    onChangeText={(event) => setSeries(event)}
                  />

                  <LabelInput value='Repetições' />
                  <TextInput
                    activeOutlineColor={colorPrimary}
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
                <Button onPress={() => addExercice(selectedVideo?.exe_id)} style={{ marginTop: 5 }}
                  textColor='white' buttonColor={`${watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo?.exe_id) ? colorRed : colorPrimary}`} mode='contained-tonal' >
                  {`${watch("exercise_plans")?.some(exercise => exercise?.exe_id === selectedVideo?.exe_id) ? "Remover exercicio" : "Adicionar"}`}
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