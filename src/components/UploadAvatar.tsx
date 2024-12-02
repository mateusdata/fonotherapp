import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FormatUser } from '../interfaces/globalInterface';
import { Sheet } from 'tamagui';
import HeaderSheet from './HeaderSheet';
import * as ImagePicker from 'expo-image-picker';
import { vibrateFeedback } from '../utils/vibrateFeedback';
import { colorPrimary } from '../style/ColorPalette';

export default function UploadAvatar({ user }: { user: FormatUser }) {
  const [image, setImage] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      const savedImageUri = await AsyncStorage.getItem('imageUri');
      if (savedImageUri) setImage(savedImageUri);
    };
    loadImage();
  }, []);

 
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [29, 29],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      await AsyncStorage.setItem('imageUri', selectedImageUri);
      setIsSheetOpen(false)
      vibrateFeedback()
    }
  };


  const pickCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert(
        "Permissão necessária",
        "Habilite o acesso à câmera nas configurações do dispositivo."
      );
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      await AsyncStorage.setItem('imageUri', selectedImageUri);
      setIsSheetOpen(false);
      vibrateFeedback();
    }
  };
  


  const pickRemove = async () => {
    setIsSheetOpen(false);
    vibrateFeedback();
    if (!image) {
      alert("Você não possui imagem de perfil")
      return
    }
    Alert.alert(
      "Apagar foto de perfil",
      "Tem certeza que deseja apagar a foto de perfil?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.removeItem("imageUri");
            setImage(null);
          },
        },
      ]
    );
  };



  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={() => setIsSheetOpen(true)} style={styles.avatarContainer}>
          {image ? (
            <Avatar.Image size={125} source={{ uri: image }} />
          ) : (
            <Avatar.Text size={125} label={user?.person.name?.charAt(0)?.toUpperCase()} />
          )}
          <Pressable style={styles.cameraIcon} onPress={() => setIsSheetOpen(true)}>
            <MaterialCommunityIcons name="camera" size={28} color="#fff" />
          </Pressable>
        </Pressable>
        <Text style={{textAlign:"center", fontSize:18, top:10}}>{ user?.person.name?.charAt(0)?.toUpperCase() + user?.person.name?.slice(1)}</Text>
      </View>

      <Sheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        modal

        dismissOnSnapToBottom
        snapPoints={['fit']}
        snapPointsMode="mixed"  >

        <Sheet.Overlay />
        <Sheet.Frame>
          <HeaderSheet />
          <View style={styles.sheetContent}>

            <View style={{
              justifyContent: "space-between", flexDirection: "row", bottom: 10
            }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10 }}>
                <TouchableOpacity   >
                  {image ? (
                    <Avatar.Image size={50} source={{ uri: image }} />
                  ) : (
                    <Avatar.Text size={50} label={user?.person.name?.charAt(0)?.toUpperCase()} />
                  )}

                </TouchableOpacity>
                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: 600 }}>Editar foto do perfil</Text>
              </View>

              <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10
              }} onPress={() => setIsSheetOpen(false)}>
                <MaterialCommunityIcons name="close" size={24} color="black" />
              </TouchableOpacity>

            </View>


            <View>

              <TouchableOpacity style={styles.option} onPress={pickCamera}>
                <MaterialCommunityIcons name="camera" size={24} color="black" />
                <Text style={styles.optionText}>Tirar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={pickImage}>
                <MaterialCommunityIcons name="image" size={24} color="black" />
                <Text style={styles.optionText}>Escolher foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={pickRemove}>
                <MaterialCommunityIcons name="trash-can" size={24} color="red" />
                <Text style={[styles.optionText, { color: 'red' }]}>Apagar foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  avatarContainer: {
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 5,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContent: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
