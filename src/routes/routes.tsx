import React, { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import * as LocalAuthentication from 'expo-local-authentication';
import { Context, useAuth } from "../context/AuthProvider";
import PublicRoutes from "./public/publicRoutes";
import PrivateRoutes from "./private/privateRoutes";
import LoadingComponent from "../components/LoadingComponent";
import { ContextGlobal, useGlobal } from "../context/GlobalContext";

const Routes = () => {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasBiometrics, setHasBiometrics] = useState(true); // Assume que há biometria por padrão
  const { useBiometrics, setUseBiometrics } = useGlobal();;

  useEffect(() => {

    const authenticate = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!useBiometrics) {
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
          return;
        }
        if (!hasHardware) {
          Alert.alert('Erro', 'Este dispositivo não suporta autenticação biométrica');
          setHasBiometrics(false); // Define que não há biometria disponível
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
          // Se não há biometria cadastrada, ainda permite o login sem biometria
          setIsAuthenticated(true);
        } else {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Autentique-se com sua impressão digital',
          });

          if (result.success) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('cautenticação biométrica', error);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar autenticar biometricamente');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (user) {
      authenticate();
    } else {
      setIsCheckingAuth(false);
    }
  }, [useBiometrics]);

  if (isCheckingAuth) {
    return <LoadingComponent />;
  }

  // Se não há biometria disponível ou o usuário não está autenticado via biometria, renderiza as rotas públicas
  if (!hasBiometrics || !isAuthenticated) {
    return <PublicRoutes />;
  }

  // Se está autenticado via biometria e tem biometria cadastrada, renderiza as rotas privadas
  if (isAuthenticated) {
    return <PrivateRoutes />;
  }

  // Se não há usuário autenticado, renderiza as rotas públicas
 return user ? <PrivateRoutes /> :< PublicRoutes/> ;};

export default Routes;
