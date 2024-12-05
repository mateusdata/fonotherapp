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

export default function UploadAvatar({ user }: { user: FormatUser }) {
  const [image, setImage] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showImage, setShowImage] = useState<boolean>(true);
  const { setUser } = useAuth();

  useEffect(() => {
    const loadImage = async () => {
      try {
        const recoveryShowImage = await AsyncStorage.getItem('showImage');
        if (recoveryShowImage !== null) {
          setShowImage(JSON.parse(recoveryShowImage));
        }

        if (user?.profile_picture_url?.includes('.jpg') && JSON.parse(recoveryShowImage || 'true')) {
          setImage(user.profile_picture_url);
        }
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
      }
    };

    loadImage();
  }, [user]);

  const handleUploadImage = async (selectedImageUri: string) => {
    try {
      const response = await fetch(selectedImageUri);
      const blob = await response.blob();
      console.log('Tamanho da imagem em MB:', (blob.size / (1024 * 1024)).toFixed(2));

      const formData:any = new FormData();
      formData.append('avatar', {
        uri: selectedImageUri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });

      const res = await api.put(`/user-picture/${user.use_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      vibrateFeedback();
      getUser(setUser);

      console.log('Upload realizado com sucesso:', res.data);
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Erro ao enviar imagem:', error.response?.data || error.message);
    }
  };

  const pickImage = async () => {
    setIsSheetOpen(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [29, 29],
      quality: 0.1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      await handleUploadImage(selectedImageUri);
    }
  };

  const pickCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Habilite o acesso à câmera nas configurações do dispositivo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      await handleUploadImage(selectedImageUri);
    }
  };

  const removeImage = async () => {
    try {
      await api.delete(`/user-picture/${user.use_id}`);
      setImage(null);
      setUser((prevUser: FormatUser) => ({
        ...prevUser,
        profile_picture_url: null,
      }));
      vibrateFeedback();
      getUser(setUser);

      console.log('Imagem removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover imagem:', error.response?.data || error.message);
    }
  };

  const confirmRemoveImage = () => {
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

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={() => setIsSheetOpen(true)} style={styles.avatarContainer}>
          {image ? (
            <Avatar.Image size={150} source={{ uri: image }} />
          ) : (
            <Avatar.Text size={150} label={user?.person.name?.[0]?.toUpperCase()} />
          )}
          <Pressable style={styles.cameraIcon} onPress={() => setIsSheetOpen(true)}>
            <MaterialCommunityIcons name="camera" size={28} color="#fff" />
          </Pressable>
        </Pressable>
        <Text style={styles.userName}>
          {user?.person.name?.charAt(0)?.toUpperCase() + user?.person.name?.slice(1)}
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
            <TouchableOpacity style={styles.option} onPress={pickCamera}>
              <MaterialCommunityIcons name="camera" size={24} color="black" />
              <Text style={styles.optionText}>Tirar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={pickImage}>
              <MaterialCommunityIcons name="image" size={24} color="black" />
              <Text style={styles.optionText}>Escolher foto</Text>
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
  userName: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
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
