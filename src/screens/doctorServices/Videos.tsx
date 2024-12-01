import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, ScrollView, Image, BackHandler, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { Searchbar } from 'react-native-paper';

import { api } from '../../config/Api'
import { colorPrimary, colorSecundary } from '../../style/ColorPalette'
import SkelectonView from '../../components/SkelectonView';
import HeaderSheet from '../../components/HeaderSheet';

import { Sheet } from 'tamagui';
import { videoUrl } from '../../utils/videoUrl';
import Segmenteds from '../../components/Segmenteds';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useIsFocused } from '@react-navigation/native';
import LinearCustomGradient from '../../components/LinearCustomGradient';

export default function Videos({ navigation }) {
  const [page, setPage] = useState(1);
  const [videosFono, setVideosFono] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [changeList, setChangeList] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videosType, setVideosType] = useState('degluticao');

  const isFocused = useIsFocused();
  const player = useVideoPlayer(videoUrl + selectedVideo?.video_urls[0], player => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {

    setModalVisible(false)
    player.pause();
    setSelectedVideo(null)
  }, [isFocused]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modalVisible) {
        player.pause();
        setSelectedVideo(null)
        setModalVisible(false)
        return true
      }
      return false;
    });

    return () => backHandler.remove();
  }, [modalVisible]);


  useEffect(() => {
    if (search === "") {
      // Se a busca estiver vazia, recarrega os vídeos
      setVideosFono([])
      setChangeList(!changeList); // Ou qualquer método que você use para recarregar os vídeos
      setPage(1)
    }
  }, [search]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(`/list-exercise?pageSize=100&page=${1}&type=${videosType}`);
        setVideosFono(response.data.data);

        //setVideosFono([...videosFono, ...response.data.data]);  //mudou aqui
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
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => {
      handleVideoPress(item);
    }}
      android_ripple={{ color: colorPrimary }}
      style={{
        flexDirection: "row", alignItems: "center", backgroundColor: "white", marginVertical: 0
      }}>
      <View style={{ padding: 10, flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: 8, }}>
        <AntDesign name="play" size={30} color={"#36B3B9"} />
        <Text>{item?.name}</Text>
      </View>
    </Pressable>
  );


  const onOpenChange = () => {
    setModalVisible(false);
    player.pause();
    setSelectedVideo(null)
  }

  if (loading) {
    return <SkelectonView />
  }
  return (
    <>
      <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "white" }}>
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

      </View>
      <Sheet
        modal
        open={modalVisible}
        dismissOnSnapToBottom
        animation="medium"

        onOpenChange={onOpenChange}
        snapPoints={[85]}

      >


        <Sheet.Overlay />

        <Sheet.Frame style={{ borderTopEndRadius: 15, borderTopStartRadius: 15 }}>
          <LinearCustomGradient />
          <HeaderSheet />


          <ScrollView style={{ backgroundColor: 'transparent', maxWidth: "100%", minWidth: "100%" }}>
            <Text style={{ textAlign: "center", fontSize: 18, marginTop: 12, color: colorSecundary, paddingHorizontal: 25 }}>{selectedVideo?.name}</Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>

              <VideoView
                style={styles.video}
                player={player}
                contentFit={"cover"}
                allowsFullscreen={false}
                nativeControls={false}
                allowsPictureInPicture={false}
              />

            </View>

            <View style={{ width: "100%", paddingTop: 5, paddingHorizontal: 25 }}>
              {selectedVideo?.description && <Text style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Descrição</Text>}
              <Text style={{ textAlign: "center", fontSize: 15 }}>{selectedVideo?.description}</Text>

              {selectedVideo?.objective && <Text style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Objetivo</Text>}
              <Text style={{ textAlign: "center", fontSize: 15 }}>{selectedVideo?.objective}</Text>

              {selectedVideo?.academic_sources && <Text style={{ textAlign: "center", fontSize: 18, color: colorSecundary }}>Referências</Text>}
              <Text style={{ textAlign: "center", fontSize: 12 }}>{`" ${selectedVideo?.academic_sources} "`}</Text>
            </View>

          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
});