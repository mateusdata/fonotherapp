import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Pressable, Alert } from 'react-native';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FormatUser } from '../interfaces/globalInterface';
import { Sheet } from 'tamagui';
import HeaderSheet from './HeaderSheet';
import * as ImagePicker from 'expo-image-picker';
import { vibrateFeedback } from '../utils/vibrateFeedback';
import { api } from '../config/Api';
import { useAuth } from '../context/AuthProvider';
import { getUser } from '../utils/getUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { colorPrimary } from '../constants/ColorPalette';
import { height } from '../utils/widthScreen';

export default function UploadAvatar({ user }: { user: FormatUser }) {
  const [image, setImage] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showImage, setShowImage] = useState<boolean>(true);
  const { setUser } = useAuth();
  const navigation: any = useNavigation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadImage = async () => {
      try {
        const recoveryShowImage = await AsyncStorage.getItem('showImage');
        if (recoveryShowImage !== null) {
          setShowImage(JSON.parse(recoveryShowImage));
          setLoading(false)
        }
        if (user.profile_picture_url !== null) {
          setImage(user?.profile_picture_url);
        }
        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
        setLoading(false)
      }
    };

    loadImage();
  }, []);


  if(loading) {
    return null;
  }

  const handleUploadImage = async (selectedImageUri: string) => {
    try {

      setShowImage(true);
      await AsyncStorage.setItem('showImage', JSON.stringify(true));
      const response = await fetch(selectedImageUri);
      const blob = await response.blob();
      console.log('Tamanho da imagem em MB:', (blob.size / (1024 * 1024)).toFixed(2));

      const formData: any = new FormData();
      formData.append('avatar', {
        uri: selectedImageUri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });

      const res = await api.put(`/user-picture/${user.use_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      vibrateFeedback();
      const result = await getUser(setUser);
      setImage(`${result?.profile_picture_url}?t=${new Date().getTime()}`);

      console.log('Upload realizado com sucesso:', res.data);
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Erro ao enviar imagem:', error.response?.data || error.message);
    }
  };

  const pickImage = async () => {
    setIsSheetOpen(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selectedImageUri = result.assets[0].uri;

      await handleUploadImage(selectedImageUri);
    }
  };

  const pickCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Habilite o acesso à câmera nas configurações do dispositivo.');
      return;
    }
    setIsSheetOpen(false);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selectedImageUri = result.assets[0].uri;
      await handleUploadImage(selectedImageUri);
    }
  };

  const removeImage = async () => {
    setIsSheetOpen(false);
    setShowImage(false);
    await AsyncStorage.setItem('showImage', JSON.stringify(false));

    try {
      setImage(null);
      setUser((prevUser: FormatUser) => ({
        ...prevUser,
        profile_picture_url: null,
      }));
      vibrateFeedback();

    } catch (error) {
      console.error('Erro ao remover imagem:', error.response?.data || error.message);
    }
  };

  const confirmRemoveImage = () => {
    setIsSheetOpen(false);
    if (!image) {
      Alert.alert('Você não possui imagem de perfil');
      return;
    }

    Alert.alert(
      'Apagar foto de perfil',
      'Tem certeza que deseja apagar a foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'OK', onPress: removeImage },
      ]
    );
  };


  const openPhoto = () => {
    setIsSheetOpen(false);
    if (user?.profile_picture_url !== null && showImage) {
      navigation.navigate('UserPhoto', { image: image });
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={openPhoto} style={styles.avatarContainer}>
          {showImage && image ? (
            <Avatar.Image size={height > 700 ? 150 : 130} source={{ uri: image }} />
          ) : (
            <Avatar.Text size={height > 700 ? 150 : 130} label={user?.person?.name?.[0]?.toUpperCase()} />
          )}
          <Pressable style={styles.cameraIcon} onPress={() => setIsSheetOpen(true)}>
            <MaterialCommunityIcons name="camera" size={28} color="#fff" />
          </Pressable>
        </Pressable>
        <Text style={styles.userName}>
          {user?.person?.name?.charAt(0)?.toUpperCase() + user?.person?.name?.slice(1)}

        </Text>
      </View>

      <Sheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        modal
        dismissOnSnapToBottom
        snapPoints={['fit']}
        snapPointsMode="mixed">
        <Sheet.Overlay />
        <Sheet.Frame>
          <HeaderSheet />
          <View style={styles.sheetContent}>
            <TouchableOpacity style={styles.option} onPress={pickImage}>
              <MaterialCommunityIcons name="image" size={24} color={colorPrimary} />
              <Text style={styles.optionText}>Escolher foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={pickCamera}>
              <MaterialCommunityIcons name="camera" size={24} color={colorPrimary} />
              <Text style={styles.optionText}>Tirar foto</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.option} onPress={confirmRemoveImage}>
              <MaterialCommunityIcons name="trash-can" size={24} color="red" />
              <Text style={[styles.optionText, { color: 'red' }]}>Apagar foto</Text>
            </TouchableOpacity>
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
    padding: height > 700 ? 15 : 0,
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
  userName: {
    textAlign: 'center',
    fontSize: 22,
    marginTop: 10,
    color: colorPrimary
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
