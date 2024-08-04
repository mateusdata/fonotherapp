import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';

const NoInternet = () => {
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        navigation.navigate('Root');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!isConnected && <Text>Sem conexão com a internet</Text>}
      {isConnected && <Button title="Conectar-se à internet" onPress={() => navigation.navigate('Root')} />}
    </View>
  );
};

export default NoInternet;
